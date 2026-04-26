import { api } from '../api/client.js';
import { navigateTo } from '../router/index.js';

export const Register = {
    render: () => `
    <div class="min-h-screen w-full relative flex items-center justify-center font-sans">
      <div class="absolute inset-0 bg-[url('/IMG/kldbuilding.jpg')] bg-cover bg-center no-repeat"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-[rgba(11,93,59,0.3)] to-[rgba(255,216,77,0.1)] backdrop-blur-[12px] z-0"></div>

      <div class="glass-panel w-[1000px] h-[680px] relative z-10 rounded-2xl overflow-hidden flex flex-col mx-4 xl:mx-0">
        
        <div class="h-[70px] bg-primary flex items-center justify-center px-8 shadow-sm">
            <div class="flex items-center gap-3 text-accent font-semibold text-base tracking-wide">
                <img src="/IMG/kldlogo.png" alt="Logo" class="h-[38px] drop-shadow-md">
                <h2>Kolehiyo ng Lungsod ng Dasmariñas</h2>
            </div>
        </div>

        <!-- Content layout -->
        <div class="flex-1 flex items-center justify-between px-16 lg:px-20">
          
          <!-- Left title -->
          <div class="flex-1 hidden md:block">
              <h1 class="text-[56px] leading-[1.15] text-primary font-extrabold tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)] fade-slide-up">
                  <span class="text-primary font-bold">Join Our</span><br>
                  <span class="text-primary text-[28px] mt-4 block leading-tight border-t border-primary/20 pt-4">Sign up to start using<br>the campus portal</span>
              </h1>
          </div>

          <div class="w-full max-w-[420px] ui-card p-8 text-center fade-slide-up" style="animation-duration: 1s;">
              <h2 class="mb-5 text-primary text-2xl font-bold">Create Account</h2>

              <form id="registerForm" class="space-y-3.5">
                  <div class="grid grid-cols-2 gap-3.5">
                    <div class="relative">
                        <input id="firstName" name="firstName" type="text" placeholder="First Name" required 
                            class="ui-input pl-9 pr-3 py-3 peer">
                        <i class="fa-solid fa-address-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                    </div>
                    <div class="relative">
                        <input id="middleName" name="middleName" type="text" placeholder="Middle Name" 
                            class="ui-input pl-9 pr-3 py-3 peer">
                        <i class="fa-regular fa-address-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:text-primary"></i>
                    </div>
                  </div>

                  <div class="relative">
                      <input id="lastName" name="lastName" type="text" placeholder="Last Name" required 
                          class="ui-input pl-10 pr-4 py-3 peer">
                      <i class="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <div class="relative">
                      <input id="email" name="email" type="email" placeholder="Email Address" autocomplete="email" required 
                          class="ui-input pl-10 pr-4 py-3 peer">
                      <i class="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <div class="relative">
                      <input id="password" name="password" type="password" placeholder="Password" required 
                          class="ui-input pl-10 pr-4 py-3 peer">
                      <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <div class="relative">
                      <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" required 
                          class="ui-input pl-10 pr-4 py-3 peer">
                      <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm peer-focus:text-primary"></i>
                  </div>

                  <button type="submit" class="ui-button-primary w-full py-3.5 mt-2 text-[15px]">
                      <i class="fa-solid fa-user-plus"></i> Sign up
                  </button>

                  <div id="registerError" class="text-red-500 text-sm text-center hidden mt-2">
                    Registration failed. Please check your details.
                  </div>

                  <div class="mt-4 text-center text-[13px]">
                      <span class="text-gray-500">Already have an account?</span>
                      <a href="#/login" class="font-medium text-primary hover:text-primary-hover hover:underline ml-1">Sign in</a>
                  </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  `,
    init: () => {
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            const errorDiv = document.getElementById('registerError');
            const btn = e.target.querySelector('button');
            const original = btn.innerHTML;

            if (password !== confirmPassword) {
                errorDiv.textContent = 'Passwords do not match.';
                errorDiv.classList.remove('hidden');
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';

            try {
                const payload = { firstName, lastName, email, password };
                const res = await api.register(payload);
                if (!res.ok) {
                    const errBody = await res.json().catch(() => ({}));
                    throw new Error(errBody.errorDescription || errBody.title || 'Registration failed');
                }

                navigateTo('/login');
            } catch (err) {
                errorDiv.textContent = err.message || 'Registration failed. Please try again.';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = original;
            }
        });
    }
};
