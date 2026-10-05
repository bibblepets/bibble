import type { NextConfig } from "next"
import { env } from "./lib/env"

const storage = new URL(env.NEXT_PUBLIC_SUPABASE_URL)
const isLocalSupabase = ["127.0.0.1", "localhost"].includes(storage.hostname)

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		// Listing photos come from the public listing-images bucket only.
		remotePatterns: [
			{
				protocol: storage.protocol.replace(":", "") as "http" | "https",
				hostname: storage.hostname,
				port: storage.port,
				pathname: "/storage/v1/object/public/listing-images/**",
			},
		],
		// Local Supabase runs on 127.0.0.1, which Next.js refuses to optimise from by default. Never on for hosted URLs.
		dangerouslyAllowLocalIP: isLocalSupabase,
	},
}

export default nextConfig
