import { api, setToken, setRefreshToken } from '../api/client.js';
import { navigateTo } from '../router/index.js';

export const Login = {
  render: () => `
    <div class="min-h-screen w-full relative flex items-center justify-center font-sans">
      <!-- Background Image -->
      <div class="absolute inset-0 bg-[url('/IMG/kldbuilding.jpg')] bg-cover bg-center no-repeat"></div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-[rgba(0,88,37,0.4)] to-[rgba(255,216,77,0.2)] backdrop-blur-[12px] z-0"></div>

      <!-- Main translucent panel -->
      <div class="glass-panel w-[1000px] h-[650px] relative z-10 rounded-2xl overflow-hidden flex flex-col mx-4 xl:mx-0">
        
        <!-- Top strip -->
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
              <h1 class="text-[58px] leading-[1.05] text-primary font-[900] tracking-tighter drop-shadow-[0_2px_15px_rgba(255,255,255,0.6)] fade-slide-up pl-4">
                  <span class="text-primary">D</span>ocument<br>
                  <span class="text-primary">W</span>orkflow<br>
                  <span class="text-primary">I</span>nformation<br>
                  <span class="text-primary">M</span>anagement<br>
                  <span class="text-primary">S</span>ystem
              </h1>
          </div>

          <!-- Login card -->
          <div class="w-full max-w-[420px] ui-card p-8 md:p-10 text-center fade-slide-up border border-white/50" style="animation-duration: 1s;">
              <h2 class="mb-8 text-primary text-3xl font-[900] tracking-tight">Log in</h2>

              <form id="loginForm" class="space-y-4">
                  <div class="relative">
                      <input id="email" type="text" placeholder="Username" required 
                          class="ui-input pl-10 pr-4 py-3.5 peer">
                      <i class="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-colors peer-focus:text-primary"></i>
                  </div>

                  <div class="relative">
                      <input id="password" type="password" placeholder="Password" required 
                          class="ui-input pl-10 pr-4 py-3.5 peer">
                      <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-colors peer-focus:text-primary"></i>
                  </div>

                  <button type="submit" class="ui-button-primary w-full py-3.5 mt-2 text-[15px]">
                      <i class="fa-solid fa-right-to-bracket"></i> Log in
                  </button>

                  <div class="flex items-center my-5">
                      <div class="flex-grow h-[1px] bg-gray-200"></div>
                      <span class="px-4 text-[11px] text-gray-400 font-bold uppercase tracking-widest">or</span>
                      <div class="flex-grow h-[1px] bg-gray-200"></div>
                  </div>

                  <div id="googleSignInBtn" class="flex justify-center w-full mb-2"></div>

                  <div class="mt-5 flex justify-between text-[13px] font-medium">
                      <a href="#/register" class="text-primary hover:text-primary-hover hover:underline transition-colors">Sign up</a>
                      <a href="#/forgot-password" class="text-primary hover:text-primary-hover hover:underline transition-colors">Forgot Password?</a>
                  </div>
                  
                  <div id="loginSuccess" class="text-green-600 text-sm text-center hidden mt-2">
                    Password reset successfully. Please sign in with your new password.
                  </div>

                  <div id="loginError" class="text-red-500 text-sm text-center hidden mt-2">
                    Invalid credentials. Please try again.
                  </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  `,
  init: () => {
    // Show success message if redirected from password reset
    const hashQuery = window.location.hash.split('?')[1] || '';
    if (new URLSearchParams(hashQuery).get('reset') === 'success') {
      document.getElementById('loginSuccess').classList.remove('hidden');
    }

    // Initialize Google Auth
    const initGoogleAuth = () => {
      window.handleGoogleCredentialResponse = async (response) => {
        const errorDiv = document.getElementById('loginError');
        errorDiv.classList.add('hidden');

        try {
          const res = await api.loginWithGoogle(response.credential);
          if (res.ok) {
            const data = await res.json();
            if (data.token) {
              setToken(data.token);
              if (data.refreshToken) setRefreshToken(data.refreshToken);
              navigateTo('/home');
            } else {
              throw new Error('Authentication failed: Missing token.');
            }
          } else {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.ErrorDescription || errData.Error || 'Google authentication failed.');
          }
        } catch (err) {
          errorDiv.innerText = err.message;
          errorDiv.classList.remove('hidden');
        }
      };

      // Prevent multiple script tags if user navigates back and forth
      if (!document.getElementById('google-gsi-client')) {
        const script = document.createElement('script');
        script.id = 'google-gsi-client';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: "661977725301-h6fg9kb4p4bckqhg3878pmhfa3ierllq.apps.googleusercontent.com",
              callback: window.handleGoogleCredentialResponse
            });
            window.google.accounts.id.renderButton(
              document.getElementById("googleSignInBtn"),
              { theme: "outline", size: "large", width: "100%", shape: "pill", type: "standard" }
            );
          }
        };
        document.body.appendChild(script);
      } else if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "661977725301-h6fg9kb4p4bckqhg3878pmhfa3ierllq.apps.googleusercontent.com",
          callback: window.handleGoogleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInBtn"),
          { theme: "outline", size: "large", width: "100%", shape: "pill", type: "standard" }
        );
      }
    };

    initGoogleAuth();

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const btn = e.currentTarget.querySelector('button');
      const errorDiv = document.getElementById('loginError');
      const original = btn.innerHTML;

      errorDiv.classList.add('hidden');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

      try {
        const res = await api.login(email, password);
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            setToken(data.token);
            if (data.refreshToken) setRefreshToken(data.refreshToken);
            navigateTo('/home');
          } else {
            throw new Error('Authentication failed: Missing token.');
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.ErrorDescription || errData.Error || 'Invalid credentials. Access denied.');
        }
      } catch (err) {
        errorDiv.innerText = err.message;
        errorDiv.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = original;
      }
    });
  }
};
