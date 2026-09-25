import { inviteTokenSchema } from "@minesweeper-flags/shared";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useGameClient } from "../features/connection/useGameClient.js";
import { LobbyPreviewPanel } from "../features/room/LobbyPreviewPanel.js";
import { useTranslation } from "../lib/i18n/useTranslation.js";
import { translateServerMessage } from "../lib/i18n/i18n-store.js";

export const InvitePage = () => {
  const { t } = useTranslation();
  const { inviteToken = "" } = useParams();
  const parsedInviteToken = inviteTokenSchema.safeParse(inviteToken.trim());
  const activeInviteToken = parsedInviteToken.success ? parsedInviteToken.data : null;
  const { connectionStatus, error, session, joinRoom, clearError } = useGameClient();
  const [displayName, setDisplayName] = useState(t("common.captainSweeper"));

  useEffect(() => {
    clearError();
  }, [activeInviteToken]);

  if (session?.roomCode) {
    return <Navigate to={`/room/${session.roomCode}`} replace />;
  }

  const trimmedDisplayName = displayName.trim();
  const canJoin = trimmedDisplayName.length > 0 && activeInviteToken !== null;
  const inviteErrorState =
    activeInviteToken === null
      ? "invalid"
      : error === "That room is already full."
        ? "full"
        : error === "That invite link is no longer valid."
          ? "invalid"
          : null;

  if (inviteErrorState) {
    const title =
      inviteErrorState === "full" ? t("invite.matchAlreadyClaimed") : t("invite.inviteUnavailable");
    const message =
      inviteErrorState === "full"
        ? t("invite.anotherPlayerFilled")
        : activeInviteToken
          ? t("invite.privateInviteExpired")
          : t("invite.inviteMalformed");

    return (
      <main className="page-shell home-page-shell">
        <section className="panel hero-panel lobby-panel invite-panel invite-error-panel">
          <div className="hero-copy invite-hero-copy">
            <p className="eyebrow">{t("invite.privateInvite")}</p>
            <h1>{title}</h1>
            <p>{message}</p>
          </div>

          <div className="waiting-action-row">
            <Link className="primary-button link-button" to="/lobby">
              {t("common.backToLobby")}
            </Link>
          </div>

          <p className="waiting-room-note">
            {t("invite.inviteLinksOnlyPath")}
          </p>
          {error && activeInviteToken ? <span className="error-text">{translateServerMessage(error)}</span> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell home-page-shell">
      <section className="panel hero-panel lobby-panel invite-panel">
        <div className="hero-copy invite-hero-copy">
          <p className="eyebrow">{t("invite.privateRoomInvitation")}</p>
          <h1>{t("invite.joinMinesweeperFlags")}</h1>
          <div className="invite-room-banner">
            <span className="invite-room-banner-label">{t("invite.inviteLinkLoaded")}</span>
            <strong>{t("invite.guestSeat")}</strong>
          </div>
          <p>
            {t("invite.someoneSharedMatch")}
          </p>
        </div>

        <div className="lobby-stage invite-stage">
          <LobbyPreviewPanel
            title={t("invite.incomingMatch")}
            badge="invite"
            featurePills={[
              t("invite.privateInviteLinkPill"),
              t("common.sharedField"),
              t("common.firstTo26")
            ]}
          />

          <section className="lobby-control-panel invite-control-panel">
            <div className="lobby-identity-card invite-summary-card">
              <div className="lobby-card-heading">
                <h2>{t("invite.joinThisRoom")}</h2>
                <span className={`lobby-connection-pill is-${connectionStatus}`}>
                  {t(`common.${connectionStatus}`)}
                </span>
              </div>

              <div className="invite-room-readout invite-private-readout">
                <span className="invite-room-readout-label">{t("invite.accessModel")}</span>
                <strong>{t("invite.tokenBasedInvite")}</strong>
              </div>

              <label className="field lobby-field">
                <span>{t("common.displayNameLabel")}</span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  maxLength={20}
                  placeholder={t("common.displayNamePlaceholder")}
                />
              </label>
            </div>

            <form
              className="lobby-action-card is-join invite-join-card"
              onSubmit={(event) => {
                event.preventDefault();

                if (!canJoin || !activeInviteToken) {
                  return;
                }

                joinRoom(trimmedDisplayName, activeInviteToken);
              }}
            >
              <div className="lobby-card-heading">
                <h2>{t("invite.joinGame")}</h2>
                <span>{t("invite.linkIsCredential")}</span>
              </div>

              <p className="invite-info-copy">
                {t("invite.matchStartsAsSoon")}
              </p>

              <button
                className={[
                  "lobby-action-button",
                  "lobby-join-button",
                  canJoin ? "is-ready" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                disabled={!canJoin}
              >
                {t("invite.joinGame")}
              </button>

              <div className="invite-secondary-actions">
                <Link className="secondary-button link-button" to="/lobby">
                  {t("common.backToLobby")}
                </Link>
              </div>
            </form>
          </section>
        </div>

        <div className="status-strip lobby-status-strip invite-status-strip">
          <span className="lobby-status-note">{t("invite.privateInviteLoaded")}</span>
          {!canJoin ? (
            <span className="lobby-status-note">{t("invite.pickDisplayNameJoinGame")}</span>
          ) : (
            <span className="lobby-status-note">{t("invite.readyToJoinPressJoinGame")}</span>
          )}
          {error ? <span className="error-text">{translateServerMessage(error)}</span> : null}
        </div>
      </section>
    </main>
  );
};
