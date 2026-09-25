import type { MatchStateDto } from "@minesweeper-flags/shared";
import { useTranslation } from "../../lib/i18n/useTranslation.js";

interface PlayerPanelsProps {
  match: MatchStateDto;
  currentPlayerId: string | null;
}

export const PlayerPanels = ({ match, currentPlayerId }: PlayerPanelsProps) => {
  const { t } = useTranslation();

  return (
    <div className="player-panels">
      {match.players.map((player) => (
        <article
          key={player.playerId}
          className={[
            "player-card",
            match.currentTurnPlayerId === player.playerId ? "is-turn" : "",
            currentPlayerId === player.playerId ? "is-self" : ""
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <header>
            <h2>{player.displayName}</h2>
            <span>{currentPlayerId === player.playerId ? t("common.you") : t("common.opponent")}</span>
          </header>
          <dl>
            <div>
              <dt>{t("player.flags")}</dt>
              <dd>{player.score}</dd>
            </div>
            <div>
              <dt>{t("player.bomb")}</dt>
              <dd>{player.bombsRemaining ? t("player.ready") : t("player.used")}</dd>
            </div>
            <div>
              <dt>{t("player.status")}</dt>
              <dd>{player.connected ? t("common.connected") : t("common.disconnected")}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
};

