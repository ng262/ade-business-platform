import ChallengeForm from "@/features/challenge/ChallengeForm";

export default function ChallengePage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ChallengeForm />
      </div>
    </div>
  );
}
