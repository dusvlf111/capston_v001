"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, UserPlus } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { formatPhoneNumber } from "@/lib/utils/formatters";
import type { ReportSchema } from "@/lib/utils/validators";

interface CompanionFormProps {
    className?: string;
}

export default function CompanionForm({ className }: CompanionFormProps) {
    const {
        control,
        register,
        formState: { errors }
    } = useFormContext<ReportSchema>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "companions"
    });

    return (
        <section className={cn("space-y-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5", className)}>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-300">동행자 정보</p>
                    <p className="text-xs text-slate-500">함께하는 사람의 연락처 및 비상 연락처를 입력하세요.</p>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => append({ name: "", phone: "", emergencyContact: "" })}
                    className="gap-2"
                >
                    <UserPlus className="h-4 w-4" />
                    함께하는 사람 추가
                </Button>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="relative rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-400">동행자 {index + 1}</span>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-slate-500 hover:text-red-400 transition-colors"
                                aria-label="동행자 삭제"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="이름"
                                placeholder="이름 입력"
                                error={errors.companions?.[index]?.name?.message}
                                {...register(`companions.${index}.name`)}
                            />
                            <Input
                                label="연락처"
                                placeholder="010-0000-0000"
                                error={errors.companions?.[index]?.phone?.message}
                                {...register(`companions.${index}.phone`, {
                                    onChange: (e) => {
                                        e.target.value = formatPhoneNumber(e.target.value);
                                    }
                                })}
                            />
                            <div className="sm:col-span-2">
                                <Input
                                    label="비상 연락처"
                                    placeholder="010-0000-0000"
                                    error={errors.companions?.[index]?.emergencyContact?.message}
                                    {...register(`companions.${index}.emergencyContact`, {
                                        onChange: (e) => {
                                            e.target.value = formatPhoneNumber(e.target.value);
                                        }
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20">
                        <p className="text-sm text-slate-500">추가된 동행자가 없습니다.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
