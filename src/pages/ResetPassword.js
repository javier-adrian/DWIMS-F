import { api } from '../api/client.js';
import { navigateTo } from '../router/index.js';

export const ResetPassword = {
  render: () => `
    <div class="min-h-screen w-full relative flex items-center justify-center font-sans">
      <div class="absolute inset-0 bg-[url('/IMG/kldbuilding.jpg')] bg-cover bg-center no-repeat"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-[rgba(11,93,59,0.3)] to-[rgba(255,216,77,0.1)] backdrop-blur-[12px] z-0"></div>

      <div class="glass-panel w-[1000px] h-[650px] relative z-10 rounded-2xl overflow-hidden flex flex-col mx-4 xl:mx-0">
        
        <div class="h-[70px] bg-primary flex items-center justify-center px-8 shadow-sm">
            <div class="flex items-center gap-3 text-accent font-semibold text-base tracking-wide">
                <img src="/IMG/kldlogo.png" alt="Logo" class="h-[38px] drop-shadow-md">
                <h2>Kolehiyo ng Lungsod ng Dasmariñas</h2>
            </div>
        </div>

        <div class="flex-1 flex items-center justify-between px-16 lg:px-20">
          
          <div class="flex-1 hidden md:block">
              <h1 class="text-[56px] leading-[1.15] text-primary font-extrabold tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)] fade-slide-up">
                  <span class="text-primary font-bold">Password</span><br>
                  <span class="text-primary font-bold">Reset</span>
              </h1>
          </div>

          <div class="w-full max-w-[380px] ui-card p-8 text-center fade-slide-up" style="animation-duration: 1s;">
              
              <div id="rpInvalidLink" class="text-red-500 text-[13px] text-center hidden mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                This reset link is invalid or has expired. Please request a new one.
                <div class="mt-2">
                  <a href="#/forgot-password" class="font-bold text-primary hover:text-primary-hover underline">Request new link</a>
                </div>
              </div>

              <form id="resetForm" class="space-y-4">
                  <h2 class="mb-2 text-primary text-2xl font-bold">New Password</h2>
                  <p class="text-gray-500 text-[13px] mb-6">Choose a secure password for your account.</p>

                  <div class="relative">
                      <input id="rpPassword" name="password" type="password" placeholder="New Password" required 
                          class="ui-input pl-10 pr-4 py-3.5 peer">
                      <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <div class="relative">
                      <input id="rpConfirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" required 
                          class="ui-input pl-10 pr-4 py-3.5 peer">
                      <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <button type="submit" id="rpSubmitBtn" class="ui-button-primary w-full py-3.5 mt-2 text-[15px] disabled:opacity-60">
                      <i class="fa-solid fa-check"></i> Reset Password
                  </button>

                  <div id="rpError" class="text-red-500 text-sm text-center hidden mt-2"></div>

                  <div class="mt-5 text-center text-[13px]">
                      <a href="#/login" class="font-medium text-primary hover:text-primary-hover hover:underline transition-colors">&larr; Back to sign in</a>
                  </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  `,
  init: () => {
    const hashQuery = window.location.hash.split('?')[1] || '';
    const params = new URLSearchParams(hashQuery);
    const userId = params.get('userId');
    const token = params.get('token');

    const invalidLinkDiv = document.getElementById('rpInvalidLink');
    const resetForm = document.getElementById('resetForm');
    const errorDiv = document.getElementById('rpError');
    const btn = document.getElementById('rpSubmitBtn');

    if (!userId || !token) {
      invalidLinkDiv.classList.remove('hidden');
      resetForm.classList.add('hidden');
      return;
    }

    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.classList.add('hidden');
      const password = document.getElementById('rpPassword').value;
      const confirmPassword = document.getElementById('rpConfirmPassword').value;

      if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.classList.remove('hidden');
        return;
      }

      btn.disabled = true;
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Resetting…';

      try {
        const res = await api.resetPassword(userId, token, password);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.errorDescription || body.title || 'Failed to reset password.');
        }
        navigateTo('/login?reset=success');
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = original;
      }
    });
  }
};
