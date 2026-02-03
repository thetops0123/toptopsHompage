import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

// URL이 유효한지 확인
const isValidUrl = supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http') && !supabaseUrl.includes('your_');

// 환경 변수가 없거나 유효하지 않으면 더미 클라이언트 생성
if (!isValidUrl) {
	console.warn(
		'Supabase env vars are missing. Using dummy client. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.',
	);

	// 더미 Supabase 클라이언트 (실제 연결 없이 에러 방지)
	supabase = {
		from: () => ({
			select: () => ({
				order: () => Promise.resolve({ data: [], error: null }),
			}),
			insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
			update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
			delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
		}),
		auth: {
			signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
		},
	};
} else {
	supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
