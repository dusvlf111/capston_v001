"use client";

import { motion } from "framer-motion";

const features = [
    {
        title: "실시간 해양 기상 정보",
        description: "Windy API를 통해 바람, 파도, 수온 등 해양 레저에 필수적인 기상 정보를 실시간으로 확인하세요.",
        icon: "🌊",
    },
    {
        title: "해양 레저 활동 신고",
        description: "간편하게 활동 계획을 신고하고 안전하게 레저를 즐기세요. 비상 연락망과 연동되어 안전을 보장합니다.",
        icon: "📝",
    },
    {
        title: "안전 알림 서비스",
        description: "기상 악화나 위험 상황 발생 시 신속하게 알림을 받아 사고를 예방할 수 있습니다.",
        icon: "🔔",
    },
];

const steps = [
    {
        step: "01",
        title: "위치 확인",
        description: "지도에서 활동할 위치의 기상 정보를 확인합니다.",
    },
    {
        step: "02",
        title: "활동 신고",
        description: "신고 페이지에서 활동 시간, 인원, 비상 연락처를 입력합니다.",
    },
    {
        step: "03",
        title: "안전 활동",
        description: "승인된 활동 계획에 따라 안전하게 레저를 즐깁니다.",
    },
];

export default function ServiceIntro() {
    return (
        <section className="bg-slate-950 py-20 text-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Hero Text */}
                <div className="mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent"
                    >
                        안전한 해양 레저의 시작
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto max-w-2xl text-lg text-slate-400"
                    >
                        실시간 기상 정보와 간편한 활동 신고로 여러분의 안전을 지켜드립니다.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <div className="mb-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 hover:border-sky-500/50 transition-colors"
                        >
                            <div className="mb-4 text-4xl">{feature.icon}</div>
                            <h3 className="mb-2 text-xl font-semibold text-slate-100">{feature.title}</h3>
                            <p className="text-slate-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* How it works */}
                <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 border border-slate-800">
                    <div className="mb-12 text-center">
                        <h2 className="text-2xl font-bold text-white sm:text-3xl">이용 방법</h2>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {steps.map((item, index) => (
                            <div key={index} className="relative text-center">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-xl font-bold text-sky-400">
                                    {item.step}
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                                <p className="text-sm text-slate-400">{item.description}</p>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-slate-800 -z-10 transform translate-x-1/2" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
