import { LoopClip } from "../media/LoopClip";

type Props = {
  /** Text alternative for the whole clip. */
  label: string;
  className?: string;
};

/** The offers bot at work in a real group. */
export function BotClip({ label, className = "" }: Props) {
  return (
    <LoopClip
      label={label}
      className={className}
      clip={{
        webm: "/media/robo/bot.webm",
        mp4: "/media/robo/bot.mp4",
        poster: "/media/robo/bot-poster.webp",
        width: 360,
        height: 748,
      }}
    />
  );
}
