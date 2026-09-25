import type { MatchStateDto } from "@minesweeper-flags/shared";
import { useTranslation } from "../../lib/i18n/useTranslation.js";

interface RematchPanelProps {
  match: MatchStateDto;
  currentPlayerId: string;
  onRequestRematch: () => void;
  onCancelRematch: () => void;
}

export const RematchPanel = ({
  match,
  currentPlayerId,
  onRequestRematch,
  onCancelRematch
}: RematchPanelProps) => {
  const { t } = useTranslation();
  const currentPlayer = match.players.find((player) => player.playerId === currentPlayerId);
  const opponent = match.players.find((player) => player.playerId !== currentPlayerId) ?? null;

  if (!currentPlayer) {
    return null;
  }

  const isWaitingForOpponent = currentPlayer.rematchRequested;
  const isOpponentWaiting = !currentPlayer.rematchRequested && Boolean(opponent?.rematchRequested);
  const rematchMessage = isWaitingForOpponent
    ? t("rematch.waitingForOtherPlayer")
    : isOpponentWaiting
      ? t("rematch.otherPlayerRequested")
      : t("rematch.readyToQueue");
  const rematchActionLabel = isWaitingForOpponent
    ? t("rematch.cancelRematch")
    : isOpponentWaiting
      ? t("rematch.acceptRematch")
      : t("rematch.requestRematch");

  return (
    <section className="panel rematch-panel">
      <p>{match.winnerPlayerId ? t("rematch.matchOver") : t("rematch.matchTied")}</p>
      <p>{rematchMessage}</p>
      <div className="action-row">
        {isWaitingForOpponent ? (
          <button className="secondary-button" onClick={onCancelRematch}>
            {rematchActionLabel}
          </button>
        ) : (
          <button className="primary-button" onClick={onRequestRematch}>
            {rematchActionLabel}
          </button>
        )}
      </div>
    </section>
  );
};
