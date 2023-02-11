import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'prompt',
            devOptions: {
                enabled: false
            },
            manifest: {
                background_color: "#1A1B20",
                theme_color: "#1A1B20",
                name: "Wersdown Earthquake",
                short_name: "Earthquake",
                description: "Google Earthquake tarafından güçlendirilmiş deprem görüntüleyici.",
                icons: [
                    // 512x Icons
                    {
                        src: "/icons/512/any-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/icons/512/maskable-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icons/512/monochrome-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "monochrome"
                    },

                    // 256x Icons
                    {
                        src: "/icons/256/any-256.png",
                        sizes: "256x256",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/icons/256/maskable-256.png",
                        sizes: "256x256",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icons/256/monochrome-256.png",
                        sizes: "256x256",
                        type: "image/png",
                        purpose: "monochrome"
                    },

                    // 128x Icons
                    {
                        src: "/icons/128/any-128.png",
                        sizes: "128x128",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/icons/128/maskable-128.png",
                        sizes: "128x128",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icons/128/monochrome-128.png",
                        sizes: "128x128",
                        type: "image/png",
                        purpose: "monochrome"
                    },

                    // 48x Icons
                    {
                        src: "/icons/48/any-48.png",
                        sizes: "48x48",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/icons/48/maskable-48.png",
                        sizes: "48x48",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icons/48/monochrome-48.png",
                        sizes: "48x48",
                        type: "image/png",
                        purpose: "monochrome"
                    },
                ]
            }
        })
    ],
    server: {
        port: 80
    }
});