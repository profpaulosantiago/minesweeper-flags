import { MIN_BOMB_DEFICIT } from "@minesweeper-flags/shared";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGameClient } from "../features/connection/useGameClient.js";
import { MatchView } from "../features/match/MatchView.js";
import { LobbyPreviewPanel } from "../features/room/LobbyPreviewPanel.js";
import { buildInvitePath } from "../features/room/invite-link.js";
import { DEPLOYMENT_MODE } from "../lib/config/env.js";
import { useTranslation } from "../lib/i18n/useTranslation.js";
import { translateServerMessage, t as translate } from "../lib/i18n/i18n-store.js";

type Translate = typeof translate;

const formatSetupStage = (t: Translate, stage: string | null | undefined): string => {
  if (!stage) {
    return t("room.starting");
  }

  switch (stage) {
    case "creating-offer":
    case "creating-session":
      return t("room.creatingDirectLink");
    case "waiting-for-guest":
      return t("room.waitingForGuest");
    case "applying-answer":
      return t("room.connectingToGuest");
    case "connecting":
      return t("common.connecting");
    case "connected":
      return t("common.connected");
    case "failed":
      return t("room.setupFailed");
    case "closed":
      return t("room.closed");
    default:
      return stage.replace(/-/g, " ");
  }
};

const isDisplacedError = (error: string | null): boolean =>
  error !== null && error.includes("active in another tab or window");

const isRecoveryUnavailableError = (error: string | null): boolean =>
  error !== null && error.includes("recovery is no longer available");

const isClaimVictoryError = (error: string | null): boolean =>
  error !== null && (error.includes("now have control") || error.includes("now have an active claim"));

const getHostSetupHeadline = (t: Translate, stage: string | null | undefined): string => {
  switch (stage) {
    case "waiting-for-guest":
      return t("room.waitingForGuest");
    case "applying-answer":
    case "connecting":
      return t("room.connectingToGuest");
    case "connected":
      return t("room.directMatchReady");
    case "failed":
      return t("room.directMatchFailed");
    case "closed":
      return t("room.directMatchClosed");
    default:
      return t("room.preparingDirectMatch");
  }
};

const getHostSetupSummary = (
  t: Translate,
  stage: string | null | undefined,
  sessionState: string | null | undefined
): string => {
  if (sessionState === "expired") {
    return t("room.expiredLinkSummary");
  }

  switch (stage) {
    case "creating-offer":
    case "creating-session":
      return t("room.creatingDirectLinkNow");
    case "waiting-for-guest":
      return t("room.waitingForGuestToOpen");
    case "applying-answer":
      return t("room.guestFoundFinishing");
    case "connected":
      return t("room.guestConnectedLoading");
    case "failed":
      return t("room.setupFailedStart");
    case "closed":
      return t("room.matchClosedStart");
    default:
      return t("room.preparingYourDirectMatch");
  }
};

const getHostSetupDetails = (
  t: Translate,
  stage: string | null | undefined,
  sessionState: string | null | undefined
): string => {
  if (sessionState === "expired") {
    return t("room.expiredCannotRecover");
  }

  if (sessionState === "answered") {
    return t("room.guestJoinedApplying");
  }

  if (sessionState === "finalized") {
    return t("room.setupFinalizedWaiting");
  }

  switch (stage) {
    case "connected":
      return t("room.roomMatchChatContinue");
    case "failed":
    case "closed":
      return t("room.useLobbyFreshLink");
    default:
      return t("room.keepTabOpenGuestOpens");
  }
};

export const RoomPage = () => {
  const { t } = useTranslation();
  const { roomCode = "" } = useParams();
  const [inviteNotice, setInviteNotice] = useState<string | null>(null);
  const {
    connectionStatus,
    error,
    session,
    match,
    bombArmed,
    chatMessages,
    chatError,
    chatDraft,
    chatPending,
    hasStoredSession,
    reconnect,
    submitCellAction,
    setChatDraft,
    sendChatMessage,
    toggleBombMode,
    resignMatch,
    requestRematch,
    cancelRematch,
    p2pSetup
  } = useGameClient();
  const isP2PDeployment = DEPLOYMENT_MODE === "p2p";
  const hostSetup = p2pSetup?.host ?? null;

  useEffect(() => {
    if (!roomCode) {
      return;
    }

    if ((!session || session.roomCode !== roomCode) && hasStoredSession(roomCode)) {
      reconnect(roomCode);
    }
  }, [hasStoredSession, reconnect, roomCode, session]);

  if (!roomCode) {
    return null;
  }

  const copyInviteValue = async (value: string, successMessage: string) => {
    try {
      await window.navigator.clipboard.writeText(value);
      setInviteNotice(successMessage);
    } catch {
      setInviteNotice(t("room.copyFailedManual"));
    }
  };

  if (!session || session.roomCode !== roomCode) {
    const showConflictGuidance = isDisplacedError(error) || isRecoveryUnavailableError(error);
    const showClaimVictory = isClaimVictoryError(error);

    return (
      <main className="page-shell room-page-shell">
        <section className="panel waiting-panel room-unavailable-panel">
          <h1>{t("room.roomUnavailable")}</h1>
          <p>
            {t("room.notAttachedPrefix")}<strong>{roomCode}</strong>{t("room.notAttachedSuffix")}
          </p>
          {showConflictGuidance && (
            <div className="conflict-guidance">
              <p className="conflict-message">{translateServerMessage(error)}</p>
              {isDisplacedError(error) && (
                <p className="conflict-action">
                  {t("room.anotherTabClaimed")}
                </p>
              )}
              {isRecoveryUnavailableError(error) && (
                <p className="conflict-action">
                  {t("room.recoveryDataCleared")}
                </p>
              )}
            </div>
          )}
          {showClaimVictory && (
            <div className="claim-victory-notice">
              <p>{translateServerMessage(error)}</p>
            </div>
          )}
          {!showConflictGuidance && !showClaimVictory && (
            <p>
              {error !== null
                ? translateServerMessage(error)
                : isP2PDeployment
                  ? t("room.p2pReconnecting")
                  : t("room.createOrJoinFirst")}
            </p>
          )}
          <div className="waiting-action-row">
            {hasStoredSession(roomCode) && !showClaimVictory && (
              <button
                className="primary-button"
                onClick={() => reconnect(roomCode)}
              >
                {t("room.reconnectButton")}
              </button>
            )}
            <Link className="primary-button link-button" to="/lobby">
              {t("room.goToLobby")}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (match) {
    return (
      <main className="page-shell room-page-shell">
        {error ? (
          <section className="panel error-banner">
            <p>{translateServerMessage(error)}</p>
          </section>
        ) : null}

        <MatchView
          roomCode={roomCode}
          currentPlayerId={session.playerId}
          match={match}
          bombArmed={bombArmed}
          connectionStatus={connectionStatus}
          chatMessages={chatMessages}
          chatError={chatError}
          chatDraft={chatDraft}
          chatPending={chatPending}
          onToggleBomb={toggleBombMode}
          onCellSelect={submitCellAction}
          onChatDraftChange={setChatDraft}
          onSendChatMessage={sendChatMessage}
          onResign={resignMatch}
          onRequestRematch={requestRematch}
          onCancelRematch={cancelRematch}
        />
      </main>
    );
  }

  if (isP2PDeployment) {
    const directJoinLink = hostSetup?.joinUrl ?? null;
    const hostStageLabel = formatSetupStage(t, hostSetup?.stage);
    const hostSetupHeadline = getHostSetupHeadline(t, hostSetup?.stage);
    const hostSetupSummary = getHostSetupSummary(t, hostSetup?.stage, hostSetup?.sessionState);
    const hostSetupDetails = getHostSetupDetails(t, hostSetup?.stage, hostSetup?.sessionState);

    return (
      <main className="page-shell home-page-shell room-page-shell">
        <section className="panel hero-panel lobby-panel waiting-lobby-panel">
          <div className="hero-copy">
            <p className="eyebrow">{t("room.directBrowserMatch")}</p>
            <h1>{t("roomLobby.hostDirectMatch")}</h1>
            <p>
              {t("room.shareOneLinkDesc")}
            </p>
          </div>

          <div className="lobby-stage waiting-lobby-stage">
            <LobbyPreviewPanel
              title={t("common.classicDuelBoard")}
              badge="p2p"
              featurePills={[
                t("room.browserToBrowser"),
                t("room.automatedSignaling"),
                t("common.bombPill", { deficit: MIN_BOMB_DEFICIT })
              ]}
            />

            <section className="lobby-control-panel waiting-control-panel">
              <div className="lobby-identity-card waiting-summary-card">
                <div className="lobby-card-heading">
                  <h2>{t("room.hostSetup")}</h2>
                  <span className={`lobby-connection-pill is-${connectionStatus}`}>
                    {hostStageLabel}
                  </span>
                </div>

                <div className="invite-room-readout invite-private-readout">
                  <span className="invite-room-readout-label">{t("room.setupStatus")}</span>
                  <strong>{hostStageLabel}</strong>
                </div>

                <div className="field lobby-field">
                  <span>{t("room.roomReference")}</span>
                  <div className="invite-code-readonly">{roomCode}</div>
                </div>

                <p className="waiting-summary-copy">
                  {t("room.keepTabOpenOwnsAuthority")}
                </p>
              </div>

              <div className="lobby-action-cards">
                <div className="lobby-action-card is-create waiting-share-card">
                  <div className="lobby-card-heading">
                    <h2>{t("room.shareDirectLink")}</h2>
                    <span>{t("room.sendOneShortLink")}</span>
                  </div>

                  {directJoinLink ? (
                    <div className="field lobby-field">
                      <span>{t("room.directJoinLink")}</span>
                      <textarea
                        className="signaling-payload-input"
                        value={directJoinLink}
                        readOnly
                        aria-label={t("room.directJoinLink")}
                      />
                    </div>
                  ) : null}

                  <div className="waiting-action-grid">
                    <button
                      className={[
                        "lobby-action-button",
                        "lobby-join-button",
                        directJoinLink ? "is-ready" : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      disabled={!directJoinLink}
                      onClick={() =>
                        directJoinLink
                          ? copyInviteValue(directJoinLink, t("room.directLinkCopiedNotice"))
                          : undefined
                      }
                    >
                      {t("room.copyDirectLink")}
                    </button>
                  </div>

                  <p className="waiting-share-copy">
                    {directJoinLink
                      ? t("room.guestOnlyNeedsLink")
                      : t("room.creatingShareableLinkNow")}
                  </p>
                </div>

                <div className="lobby-action-card is-join waiting-room-card">
                  <div className="lobby-card-heading">
                    <h2>{hostSetupHeadline}</h2>
                    <span>{hostSetupSummary}</span>
                  </div>

                  <div className="invite-room-readout invite-private-readout">
                    <span className="invite-room-readout-label">{t("room.signalingSession")}</span>
                    <strong>{hostSetup?.sessionState ?? t("room.startingLower")}</strong>
                  </div>

                  <p className="waiting-room-copy">{hostSetupDetails}</p>
                </div>
              </div>
            </section>
          </div>

          <div className="status-strip lobby-status-strip">
            <span className="lobby-status-note">
              {inviteNotice ?? hostSetupSummary}
            </span>
            <span className="lobby-status-note">{hostSetupDetails}</span>
            <Link className="lobby-status-link" to="/lobby">
              {t("common.backToLobby")}
            </Link>
            {hostSetup?.error ? <span className="error-text">{translateServerMessage(hostSetup.error)}</span> : null}
            {error ? <span className="error-text">{translateServerMessage(error)}</span> : null}
          </div>
        </section>
      </main>
    );
  }

  const host = session.players[0];
  const opponent = session.players[1];
  const inviteToken = session.inviteToken ?? null;
  const inviteLink =
    session.inviteToken && typeof window !== "undefined"
      ? `${window.location.origin}${buildInvitePath(session.inviteToken)}`
      : session.inviteToken
        ? buildInvitePath(session.inviteToken)
        : null;

  return (
    <main className="page-shell home-page-shell room-page-shell">
      <section className="panel hero-panel lobby-panel waiting-lobby-panel">
        <div className="hero-copy">
          <p className="eyebrow">{t("roomLobby.eyebrow")}</p>
          <h1>{t("roomLobby.title")}</h1>
          <p>
            {t("room.roomIsReadyPrefix")}<strong>{roomCode}</strong>{t("room.roomIsReadySuffix")}
          </p>
        </div>

        <div className="lobby-stage">
          <LobbyPreviewPanel
            title={t("common.classicDuelBoard")}
            badge={t("common.twoPlayersBadge")}
            featurePills={[
              t("common.sharedField"),
              t("common.firstTo26"),
              t("common.bombPill", { deficit: MIN_BOMB_DEFICIT })
            ]}
          />

          <section className="lobby-control-panel">
            <div className="lobby-identity-card">
              <div className="lobby-card-heading">
                <h2>{t("room.roomReady")}</h2>
                <span className={`lobby-connection-pill is-${connectionStatus}`}>{t(`common.${connectionStatus}`)}</span>
              </div>

              <div className="field lobby-field">
                <span>{t("room.roomReference")}</span>
                <div className="invite-code-readonly">{roomCode}</div>
              </div>
            </div>

            <div className="lobby-action-cards">
              <div className="lobby-action-card is-create">
                <div className="lobby-card-heading">
                  <h2>{t("room.shareThisRoom")}</h2>
                  <span>{t("room.copyPrivateInvite")}</span>
                </div>

                <button
                  className="lobby-action-button lobby-create-button"
                  disabled={!inviteLink}
                  onClick={() =>
                    inviteLink
                      ? copyInviteValue(inviteLink, t("room.inviteLinkCopiedNotice"))
                      : undefined
                  }
                >
                  {inviteLink ? t("room.copyInviteLink") : t("room.inviteLinkUnavailable")}
                </button>
              </div>

              <div className="lobby-action-card is-join">
                <div className="lobby-card-heading">
                  <h2>{t("room.copyInviteTokenTitle")}</h2>
                  <span>{opponent ? t("room.guestConnectedLabel") : t("room.manualFallback")}</span>
                </div>

                <div className="field lobby-field">
                  <span>{t("roomLobby.inviteTokenLabel")}</span>
                  <div className="invite-code-readonly invite-token-readonly">{inviteToken ?? t("room.unavailable")}</div>
                </div>

                <button
                  className={[
                    "lobby-action-button",
                    "lobby-join-button",
                    inviteToken ? "is-ready" : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={!inviteToken}
                  onClick={() =>
                    inviteToken
                      ? copyInviteValue(inviteToken, t("room.inviteTokenCopiedNotice"))
                      : undefined
                  }
                >
                  {inviteToken ? t("room.copyInviteTokenTitle") : t("room.inviteTokenUnavailable")}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="status-strip lobby-status-strip">
          <span className="lobby-status-note">
            {inviteNotice ?? (inviteLink ? t("room.waitingForPlayerTwo") : t("room.inviteLinkUnavailableDevice"))}
          </span>
          <span className="lobby-status-note">
            {t("room.hostLine", { name: host?.displayName ?? session.displayName })}{" "}
            {opponent ? t("room.guestJoinedAs", { name: opponent.displayName }) : t("room.guestSlotOpen")}
          </span>
          <Link className="lobby-status-link" to="/lobby">
            {t("common.backToLobby")}
          </Link>
          {error ? <span className="error-text">{translateServerMessage(error)}</span> : null}
        </div>
      </section>
    </main>
  );
};
