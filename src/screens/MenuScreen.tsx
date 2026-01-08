import React, { useEffect, useState, useRef } from 'react';
import { Icons, RULES } from '../constants.tsx';
import { type UserProfile } from '../gameTypes';


interface MenuScreenProps {
  onStart: () => void;
  onRemoveAds: () => void;
  adsRemoved: boolean;
  user: UserProfile | null;
  onLogin: (user: UserProfile) => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onStart, onRemoveAds, adsRemoved, user, onLogin }) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const initGoogle = () => {
      // @ts-ignore
      if (window.google && window.google.accounts && !initialized.current) {
        setGoogleLoaded(true);
        try {
          initialized.current = true;
          // @ts-ignore
          window.google.accounts.id.initialize({
            client_id: "784261770997-fake-id.apps.googleusercontent.com", 
            callback: (response: any) => {
              try {
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                
                onLogin({
                  id: payload.sub,
                  name: payload.name,
                  email: payload.email,
                  picture: payload.picture
                });
              } catch (e) {
                console.error("Auth Parse Error:", e);
              }
            },
            auto_select: false,
            itp_support: true
          });

          if (!user && googleBtnRef.current) {
            // @ts-ignore
            window.google.accounts.id.renderButton(
              googleBtnRef.current,
              { theme: "filled_blue", size: "large", width: 280, shape: "pill" }
            );
          }
        } catch (err) {
          console.error("Google Auth Init Error:", err);
          initialized.current = false;
        }
      }
    };

    const checkInterval = setInterval(() => {
      // @ts-ignore
      if (window.google?.accounts?.id) {
        initGoogle();
        clearInterval(checkInterval);
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, [user, onLogin]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center select-none overflow-hidden relative bg-slate-900">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square bg-amber-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square bg-sky-500/10 rounded-full blur-[100px]"></div>

      <div className="mb-8 animate-bounce">
        <Icons.Star className="w-24 h-24 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" fill="currentColor" />
      </div>

      <h1 className="text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">
        STAR<span className="text-amber-400 italic">CLEAR</span>
      </h1>
      <p className="text-slate-400 mb-12 font-medium italic text-lg opacity-80 uppercase tracking-[0.2em]">
        Catch the Stars, Clear the Galaxy
      </p>

      <div className="space-y-4 w-full max-w-xs z-10 animate-in">
        {user ? (
          <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-[2rem] border border-slate-700/50 mb-6 flex items-center gap-4 shadow-2xl">
            <img src={user.picture} alt="profile" className="w-14 h-14 rounded-full border-2 border-amber-500 shadow-lg" />
            <div className="text-left">
              <div className="text-white font-black text-base leading-tight">Hello, {user.name}</div>
              <div className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                Account Synced
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 mb-8">
            <div ref={googleBtnRef} className="min-h-[44px] flex items-center justify-center w-full transition-all">
               {!googleLoaded && <div className="text-slate-500 text-xs font-bold animate-pulse italic">Connecting to Universe...</div>}
            </div>
            {!googleLoaded && (
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                Sign in to save your 100 levels progress
              </p>
            )}
          </div>
        )}

        <button 
          onClick={onStart}
          className="w-full py-6 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all rounded-[2rem] text-slate-900 font-black text-3xl shadow-[0_10px_0_rgb(180,130,10)] flex items-center justify-center gap-3"
        >
          <Icons.Play className="w-10 h-10" />
          PLAY NOW
        </button>

        {/* 광고 제거 버튼이 삭제되었습니다. */}
      </div>

      <div className="absolute bottom-8 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
        v1.0.9 Core Edition
      </div>
    </div>
  );
};

export default MenuScreen;

// interface MenuScreenProps {
//   onStart: () => void;
//   onRemoveAds: () => void;
//   adsRemoved: boolean;
//   user: UserProfile | null;
//   onLogin: (user: UserProfile) => void;
// }

// const MenuScreen: React.FC<MenuScreenProps> = ({ onStart, onRemoveAds, adsRemoved, user, onLogin }) => {
//   const [googleLoaded, setGoogleLoaded] = useState(false);
//   const googleBtnRef = useRef<HTMLDivElement>(null);
//   const initialized = useRef(false);

//   useEffect(() => {
//     const initGoogle = () => {
//       // @ts-ignore
//       if (window.google && window.google.accounts && !initialized.current) {
//         setGoogleLoaded(true);
//         try {
//           initialized.current = true;
//           // @ts-ignore
//           window.google.accounts.id.initialize({
//             client_id: "784261770997-fake-id.apps.googleusercontent.com", 
//             callback: (response: any) => {
//               try {
//                 const base64Url = response.credential.split('.')[1];
//                 const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//                 const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
//                   return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//                 }).join(''));
//                 const payload = JSON.parse(jsonPayload);
                
//                 onLogin({
//                   id: payload.sub,
//                   name: payload.name,
//                   email: payload.email,
//                   picture: payload.picture
//                 });
//               } catch (e) {
//                 console.error("Auth Parse Error:", e);
//               }
//             },
//             auto_select: false,
//             itp_support: true
//           });

//           if (!user && googleBtnRef.current) {
//             // @ts-ignore
//             window.google.accounts.id.renderButton(
//               googleBtnRef.current,
//               { theme: "filled_blue", size: "large", width: 280, shape: "pill" }
//             );
//           }
//         } catch (err) {
//           console.error("Google Auth Init Error:", err);
//           initialized.current = false;
//         }
//       }
//     };

//     const checkInterval = setInterval(() => {
//       // @ts-ignore
//       if (window.google?.accounts?.id) {
//         initGoogle();
//         clearInterval(checkInterval);
//       }
//     }, 500);

//     return () => clearInterval(checkInterval);
//   }, [user, onLogin]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center select-none overflow-hidden relative bg-slate-900">
//       {/* Background Decor */}
//       <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square bg-amber-500/10 rounded-full blur-[100px]"></div>
//       <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square bg-sky-500/10 rounded-full blur-[100px]"></div>

//       <div className="mb-8 animate-bounce">
//         <Icons.Star className="w-24 h-24 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" fill="currentColor" />
//       </div>

//       <h1 className="text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">
//         STAR<span className="text-amber-400 italic">CLEAR</span>
//       </h1>
//       <p className="text-slate-400 mb-12 font-medium italic text-lg opacity-80 uppercase tracking-[0.2em]">
//         Catch the Stars, Clear the Galaxy
//       </p>

//       <div className="space-y-4 w-full max-w-xs z-10 animate-in">
//         {user ? (
//           <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-[2rem] border border-slate-700/50 mb-6 flex items-center gap-4 shadow-2xl">
//             <img src={user.picture} alt="profile" className="w-14 h-14 rounded-full border-2 border-amber-500 shadow-lg" />
//             <div className="text-left">
//               <div className="text-white font-black text-base leading-tight">Hello, {user.name}</div>
//               <div className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-1">
//                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
//                 Account Synced
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center gap-4 mb-8">
//             <div ref={googleBtnRef} className="min-h-[44px] flex items-center justify-center w-full transition-all">
//                {!googleLoaded && <div className="text-slate-500 text-xs font-bold animate-pulse italic">Connecting to Universe...</div>}
//             </div>
//             {!googleLoaded && (
//               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
//                 Sign in to save your 100 levels progress
//               </p>
//             )}
//           </div>
//         )}

//         <button 
//           onClick={onStart}
//           className="w-full py-6 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all rounded-[2rem] text-slate-900 font-black text-3xl shadow-[0_10px_0_rgb(180,130,10)] flex items-center justify-center gap-3"
//         >
//           <Icons.Play className="w-10 h-10" />
//           PLAY NOW
//         </button>

//         {!adsRemoved && (
//           <button 
//             onClick={onRemoveAds}
//             className="w-full py-4 bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold rounded-[1.5rem] border border-slate-700/50 transition-all flex flex-col items-center leading-tight shadow-lg mt-4 group"
//           >
//             <span className="text-[10px] opacity-50 group-hover:opacity-100 uppercase tracking-widest">ADS REMOVAL</span>
//             <span className="text-amber-400 text-xl font-black">${RULES.AD_REMOVE_PRICE}</span>
//           </button>
//         )}
//       </div>

//       <div className="absolute bottom-8 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
//         v1.0.9 Core Edition
//       </div>
//     </div>
//   );
// };

// export default MenuScreen;