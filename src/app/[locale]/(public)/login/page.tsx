import LoginClient from "@/components/LoginClient";
import { getDictionary } from "@/utils/get-dictionary";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();

  const handleLogin = () => {
    // Mock login by setting a cookie
    document.cookie = "auth_token=true; path=/; max-age=86400"; // Expires in 1 day
    router.refresh(); // Refresh to update middleware state
    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Access SimilePro
        </h1>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
          This is a public route. Click below to simulate logging in.
        </p>
        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign In (Mock)
        </button>
        <div className="mt-4 text-center">
            <a href={`/${locale}`} className="text-sm text-blue-500 hover:underline">Back to Home</a>
        </div>
      </div>
    </div>
  );
}
