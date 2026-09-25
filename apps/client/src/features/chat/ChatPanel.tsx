import type { ChatMessageDto } from "@minesweeper-flags/shared";
import { useTranslation } from "../../lib/i18n/useTranslation.js";
import { translateServerMessage } from "../../lib/i18n/i18n-store.js";
import { ChatMessageList } from "./ChatMessageList.js";

type ConnectionStatus = "disconnected" | "connecting" | "connected";
type PlayerTone = "blue" | "red";

interface ChatPanelProps {
  roomCode: string;
  currentPlayerId: string;
  playerTones: Record<string, PlayerTone>;
  connectionStatus: ConnectionStatus;
  messages: ChatMessageDto[];
  draft: string;
  pending: boolean;
  error: string | null;
  helperText?: string;
  className?: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}

export const ChatPanel = ({
  roomCode,
  currentPlayerId,
  playerTones,
  connectionStatus,
  messages,
  draft,
  pending,
  error,
  helperText,
  className,
  onDraftChange,
  onSend
}: ChatPanelProps) => {
  const { t } = useTranslation();
  const sendDisabled = connectionStatus !== "connected" || pending || !draft.trim();
  const statusMessage = error
    ? translateServerMessage(error)
    : pending
      ? t("chat.sending")
      : connectionStatus !== "connected"
        ? t("chat.chatOffline")
        : helperText ?? t("chat.pressEnterToSend");

  return (
    <section className={["classic-chat-frame", className].filter(Boolean).join(" ")}>
      <header className="chat-panel-header">
        <div>
          <h2>{t("chat.messenger")}</h2>
          <span>{t("common.roomLabel", { roomCode })}</span>
        </div>
        <span className={`chat-connection-pill is-${connectionStatus}`}>{t(`common.${connectionStatus}`)}</span>
      </header>

      <ChatMessageList
        currentPlayerId={currentPlayerId}
        playerTones={playerTones}
        messages={messages}
      />

      <form
        className="chat-composer"
        onSubmit={(event) => {
          event.preventDefault();

          if (!sendDisabled) {
            onSend();
          }
        }}
      >
        <input
          value={draft}
          disabled={pending}
          placeholder={t("chat.typeMessage")}
          onChange={(event) => onDraftChange(event.target.value)}
        />
        <button type="submit" disabled={sendDisabled}>
          {t("chat.send")}
        </button>
      </form>

      <p className={["chat-inline-status", error ? "is-error" : ""].filter(Boolean).join(" ")}>
        {statusMessage}
      </p>
    </section>
  );
};
