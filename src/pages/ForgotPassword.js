import { api } from '../api/client.js';

export const ForgotPassword = {
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
                  <span class="text-primary font-bold">Reset</span><br>
                  <span class="text-primary font-bold">Password</span>
              </h1>
          </div>

          <div class="w-full max-w-[380px] ui-card p-8 text-center fade-slide-up" style="animation-duration: 1s;">
              <h2 class="mb-2 text-primary text-2xl font-bold">Forgot Password</h2>
              <p class="text-gray-500 text-[13px] mb-6">Enter your email and we'll send you a reset link.</p>

              <form id="forgotForm" class="space-y-4">
                  <div class="relative">
                      <input id="fpEmail" name="email" type="email" placeholder="Email Address" required 
                          class="ui-input pl-10 pr-4 py-3.5 peer">
                      <i class="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <button type="submit" id="fpSubmitBtn" class="ui-button-primary w-full py-3.5 mt-2 text-[15px] disabled:opacity-60">
                      <i class="fa-solid fa-paper-plane"></i> Send Link
                  </button>

                  <div id="fpError" class="text-red-500 text-sm text-center hidden mt-2"></div>
                  <div id="fpSuccess" class="text-green-600 text-sm text-center hidden mt-2 px-2">
                    If that email is registered, you will receive a password reset link shortly.
                  </div>

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
    const form = document.getElementById('forgotForm');
    const errorDiv = document.getElementById('fpError');
    const successDiv = document.getElementById('fpSuccess');
    const btn = document.getElementById('fpSubmitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.classList.add('hidden');
      successDiv.classList.add('hidden');
      btn.disabled = true;
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

      const email = document.getElementById('fpEmail').value.trim();

      try {
        const res = await api.forgotPassword(email);
        if (!res.ok && res.status !== 404) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.errorDescription || body.title || 'Something went wrong.');
        }
        successDiv.classList.remove('hidden');
        form.querySelector('input').value = '';
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    });
  }
};
