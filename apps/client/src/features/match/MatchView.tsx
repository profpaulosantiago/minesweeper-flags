import {
  MIN_BOMB_DEFICIT,
  type ChatMessageDto,
  type MatchStateDto
} from "@minesweeper-flags/shared";
import { BoardGrid } from "../../entities/board/BoardGrid.js";
import { BombIcon } from "../../shared-ui/BombIcon.js";
import { FlagIcon } from "../../shared-ui/FlagIcon.js";
import { useTranslation } from "../../lib/i18n/useTranslation.js";
import { ChatPanel } from "../chat/ChatPanel.js";
import { RematchPanel } from "../rematch/RematchPanel.js";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

interface MatchViewProps {
  roomCode: string;
  currentPlayerId: string;
  match: MatchStateDto;
  bombArmed: boolean;
  connectionStatus: ConnectionStatus;
  chatMessages: ChatMessageDto[];
  chatError: string | null;
  chatDraft: string;
  chatPending: boolean;
  onToggleBomb: () => void;
  onCellSelect: (row: number, column: number) => void;
  onChatDraftChange: (value: string) => void;
  onSendChatMessage: () => void;
  onResign: () => void;
  onRequestRematch: () => void;
  onCancelRematch: () => void;
}

export const MatchView = ({
  roomCode,
  currentPlayerId,
  match,
  bombArmed,
  connectionStatus,
  chatMessages,
  chatError,
  chatDraft,
  chatPending,
  onToggleBomb,
  onCellSelect,
  onChatDraftChange,
  onSendChatMessage,
  onResign,
  onRequestRematch,
  onCancelRematch
}: MatchViewProps) => {
  const { t } = useTranslation();
  const [bluePlayer, redPlayer] = match.players;
  const currentPlayer = match.players.find((player) => player.playerId === currentPlayerId) ?? null;
  const opponent = match.players.find((player) => player.playerId !== currentPlayerId) ?? null;
  const canAct = match.phase === "live" && match.currentTurnPlayerId === currentPlayerId;
  const scoreDeficit = currentPlayer && opponent ? opponent.score - currentPlayer.score : 0;
  const canBomb = Boolean(
    currentPlayer &&
      opponent &&
      currentPlayer.bombsRemaining === 1 &&
      scoreDeficit >= MIN_BOMB_DEFICIT
  );
  const playerTones: Record<string, "blue" | "red"> = {
    [bluePlayer.playerId]: "blue",
    [redPlayer.playerId]: "red"
  };
  const activeTone =
    match.currentTurnPlayerId && playerTones[match.currentTurnPlayerId]
      ? playerTones[match.currentTurnPlayerId]
      : "blue";
  const opponentLastMove =
    match.lastAction && match.lastAction.playerId !== currentPlayerId
      ? {
          row: match.lastAction.row,
          column: match.lastAction.column,
          tone: playerTones[match.lastAction.playerId] ?? "blue"
        }
      : null;
  const playerSlots = [
    {
      title: t("common.blueLabel"),
      tone: "blue" as const,
      player: bluePlayer,
      isSelf: bluePlayer.playerId === currentPlayerId,
      isTurn: match.currentTurnPlayerId === bluePlayer.playerId
    },
    {
      title: t("common.redLabel"),
      tone: "red" as const,
      player: redPlayer,
      isSelf: redPlayer.playerId === currentPlayerId,
      isTurn: match.currentTurnPlayerId === redPlayer.playerId
    }
  ];
  const renderPlayerSlot = (slot: (typeof playerSlots)[number]) => (
    <section
      key={slot.player.playerId}
      className={[
        "sidebar-player-panel",
        `sidebar-player-panel-${slot.tone}`,
        slot.isTurn ? "is-turn" : "",
        slot.isSelf ? "is-self" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/*
        Bomb availability is easy to miss, so give the active player a distinct
        ready state instead of relying on the disabled button contrast alone.
      */}
      <header className="sidebar-player-header">
        <span className="sidebar-player-title">{slot.title}</span>
        <span className="sidebar-player-role">{slot.isSelf ? t("match.youRole") : t("match.opponentRole")}</span>
      </header>

      <div className="sidebar-player-avatar">
        <span>{slot.player.displayName.slice(0, 1).toUpperCase()}</span>
      </div>

      <p className="sidebar-player-name">{slot.player.displayName}</p>
      <p className="sidebar-player-connection">
        {slot.player.connected ? t("common.connected") : t("common.disconnected")}
      </p>

      <div className="sidebar-score-strip">
        <div className="sidebar-pill sidebar-score-pill">
          <FlagIcon color={slot.tone} size={22} />
          <strong>{slot.player.score}</strong>
        </div>
        {(() => {
          const bombVariant =
            slot.player.bombsRemaining === 0
              ? "spent"
              : slot.isSelf && bombArmed
                ? "armed"
                : slot.isSelf && canAct && canBomb
                  ? "ready"
                  : "idle";
          const bombLabel =
            slot.player.bombsRemaining === 0
              ? slot.isSelf
                ? t("match.yourBombSpent")
                : t("match.opponentBombSpent")
              : slot.isSelf && canAct && canBomb
                ? bombArmed
                  ? t("match.bombArmedPickCenterAria")
                  : t("match.bombReadyClickToArmAria")
                : slot.isSelf
                  ? t("match.bombUnusedTrailing", { deficit: MIN_BOMB_DEFICIT })
                  : t("match.opponentBombStatus");

          return (
            <button
              aria-label={bombLabel}
              className={[
                "sidebar-pill",
                "sidebar-bomb-pill",
                slot.isSelf && canAct && canBomb ? "is-ready" : "",
                slot.isSelf && bombArmed ? "is-armed" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={slot.isSelf ? onToggleBomb : undefined}
              disabled={!slot.isSelf || !canAct || !canBomb}
              title={
                slot.isSelf && canAct && canBomb
                  ? t("match.bombReadyClickToArmTitle")
                  : t("match.bombOneUseTitle", { deficit: MIN_BOMB_DEFICIT })
              }
            >
              <BombIcon className="sidebar-bomb-icon" variant={bombVariant} size={19} />
            </button>
          );
        })()}
      </div>

      <div className="sidebar-turn-box">
        {match.phase === "finished" ? (
          <p>
            {match.winnerPlayerId === slot.player.playerId
              ? t("match.winner")
              : match.winnerPlayerId
                ? t("match.defeated")
              : t("match.draw")}
          </p>
        ) : slot.isSelf ? (
          <p>
            {slot.isTurn
              ? bombArmed
                ? t("match.bombArmedPickCenterShort")
                : canBomb
                  ? t("match.yourTurnBombReady")
                  : scoreDeficit > 0 && scoreDeficit < MIN_BOMB_DEFICIT
                    ? t("match.yourTurnBombUnlocksAt", { deficit: MIN_BOMB_DEFICIT })
                    : t("match.yourTurnMakeMove")
              : t("match.waitYourTurn")}
          </p>
        ) : slot.isTurn ? (
          <p>{t("match.playerIsMoving", { name: slot.title })}</p>
        ) : (
          <p>{t("match.playerIsWaiting", { name: slot.title })}</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="classic-game-window">
      <div className="classic-match-shell">
        <aside className="classic-sidebar-frame">
          {renderPlayerSlot(playerSlots[0])}

          <div className="sidebar-center-strip">
            <div className="star-meter">
              <span className="star-glyph">★</span>
              <strong>{match.turnNumber}</strong>
              <span className="star-glyph">★</span>
            </div>
            <div className="room-code-pill">{t("common.roomLabel", { roomCode })}</div>
            <div className={`move-pill move-pill-${activeTone}`}>
              {match.phase === "finished"
                ? t("match.matchOver")
                : t("match.moveLabel", {
                    tone: activeTone === "blue" ? t("common.blueLabel") : t("common.redLabel")
                  })}
            </div>
          </div>

          {renderPlayerSlot(playerSlots[1])}

          <button
            className="sidebar-resign-button"
            disabled={match.phase !== "live"}
            onClick={() => {
              if (window.confirm(t("match.resignConfirm"))) {
                onResign();
              }
            }}
          >
            {t("match.resign")}
          </button>
        </aside>

        <section className="classic-main-shell">
          <div className="classic-board-shell">
            <div className="classic-board-frame">
              <BoardGrid
                match={match}
                canAct={canAct}
                bombArmed={bombArmed}
                playerTones={playerTones}
                opponentLastMove={opponentLastMove}
                onSelectCell={onCellSelect}
              />
            </div>
          </div>
        </section>

        {match.phase === "finished" ? (
          <RematchPanel
            match={match}
            currentPlayerId={currentPlayerId}
            onRequestRematch={onRequestRematch}
            onCancelRematch={onCancelRematch}
          />
        ) : null}

        <ChatPanel
          roomCode={roomCode}
          currentPlayerId={currentPlayerId}
          playerTones={playerTones}
          connectionStatus={connectionStatus}
          messages={chatMessages}
          draft={chatDraft}
          pending={chatPending}
          error={chatError}
          helperText={
            opponent
              ? t("match.opponentStatusLine", {
                  name: opponent.displayName,
                  status: opponent.connected ? t("common.online") : t("common.offline")
                })
              : t("match.waitingForSecondPlayer")
          }
          className="classic-match-chat"
          onDraftChange={onChatDraftChange}
          onSend={onSendChatMessage}
        />
      </div>
    </div>
  );
};
