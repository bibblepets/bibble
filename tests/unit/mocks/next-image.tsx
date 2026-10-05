/* eslint-disable @next/next/no-img-element -- a plain img stands in for next/image, whose loader needs Next's config */
export default function MockImage({ src, alt }: { src: string; alt: string }) {
	return <img src={src} alt={alt} />
}
