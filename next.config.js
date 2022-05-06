/** @type {import('next').NextConfig} */

const nextConfig = {
	swcMinify: true,
	reactStrictMode: true,
	compiler: {
		styledComponents: true,
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
			};
		}

		return config;
	},
};

module.exports = nextConfig;
