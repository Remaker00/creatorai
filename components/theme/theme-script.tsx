import { THEME_STORAGE_KEY } from "@/lib/theme-config";

// Runs before first paint so there's no flash of the wrong theme: saved choice, else the OS setting.
const script = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
