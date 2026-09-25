import { INVITE_TOKEN_LENGTH, MIN_BOMB_DEFICIT } from "@minesweeper-flags/shared";
import { useEffect, useState } from "react";
import type { SlotAvailability } from "../../app/providers/GameClientProvider.js";
import type { DeploymentMode } from "../../lib/config/env.js";
import { useTranslation } from "../../lib/i18n/useTranslation.js";
import { translateServerMessage } from "../../lib/i18n/i18n-store.js";
import { extractInviteToken } from "./invite-link.js";
import { LobbyPreviewPanel } from "./LobbyPreviewPanel.js";

interface RoomLobbyProps {
  connectionStatus: string;
  deploymentMode: DeploymentMode;
  error: string | null;
  initialInviteValue?: string;
  slotAvailability?: SlotAvailability | null;
  onRefreshSlots?: () => void;
  onCreateRoom: (displayName: string) => void;
  onJoinRoom: (displayName: string, inviteToken: string) => void;
}

export const RoomLobby = ({
  connectionStatus,
  deploymentMode,
  error,
  initialInviteValue = "",
  slotAvailability = null,
  onRefreshSlots,
  onCreateRoom,
  onJoinRoom
}: RoomLobbyProps) => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState(t("common.captainSweeper"));
  const [inviteValue, setInviteValue] = useState(initialInviteValue);
  const trimmedDisplayName = displayName.trim();
  const inviteToken = extractInviteToken(inviteValue);
  const slotsFull = slotAvailability !== null && slotAvailability.activeRooms >= slotAvailability.maxRooms;
  const canCreateRoom = trimmedDisplayName.length > 0 && !slotsFull;
  const canJoinRoom = trimmedDisplayName.length > 0 && inviteToken !== null;
  const isP2PDeployment = deploymentMode === "p2p";

  const [refreshing, setRefreshing] = useState(false);

  const handleCreateRoom = () => {
    if (!canCreateRoom) {
      return;
    }

    onCreateRoom(trimmedDisplayName);
    onRefreshSlots?.();
  };

  const handleRefreshSlots = () => {
    setRefreshing(true);
    onRefreshSlots?.();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleJoinRoom = () => {
    if (!canJoinRoom || !inviteToken) {
      return;
    }

    onJoinRoom(trimmedDisplayName, inviteToken);
  };

  useEffect(() => {
    if (initialInviteValue) {
      setInviteValue(initialInviteValue);
    }
  }, [initialInviteValue]);

  return (
    <section className="panel hero-panel lobby-panel">
      <div className="hero-copy">
        <p className="eyebrow">{t("roomLobby.eyebrow")}</p>
        <h1>{t("roomLobby.title")}</h1>
        <p>{t("roomLobby.description")}</p>
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
              <h2>{t("roomLobby.getReady")}</h2>
              <span className={`lobby-connection-pill is-${connectionStatus}`}>
                {t(`common.${connectionStatus}`)}
              </span>
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

          <div className="lobby-action-cards">
            {isP2PDeployment ? (
              <>
                <form
                  className="lobby-action-card is-create"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleCreateRoom();
                  }}
                >
                  <div className="lobby-card-heading">
                    <h2>{t("roomLobby.hostDirectMatch")}</h2>
                    <span>{t("roomLobby.hostDirectMatchDesc")}</span>
                  </div>

                  <button
                    className="lobby-action-button lobby-create-button"
                    disabled={!canCreateRoom}
                  >
                    {t("roomLobby.hostDirectMatch")}
                  </button>
                </form>

                <div className="lobby-action-card is-join">
                  <div className="lobby-card-heading">
                    <h2>{t("roomLobby.joinDirectMatch")}</h2>
                    <span>{t("roomLobby.joinDirectMatchDesc")}</span>
                  </div>

                  <p className="waiting-room-copy">
                    {t("roomLobby.guestJoinCopy")}
                  </p>

                  <button
                    className="lobby-action-button lobby-join-button"
                    disabled
                    type="button"
                  >
                    {t("roomLobby.joinDirectMatch")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <form
                  className="lobby-action-card is-create"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleCreateRoom();
                  }}
                >
                  <div className="lobby-card-heading">
                    <div className="lobby-card-heading-row">
                      <h2>{t("roomLobby.createAMatch")}</h2>
                      {slotAvailability !== null && (
                        <span className="lobby-slot-indicator">
                          <span className={`lobby-slot-pill${slotsFull ? " is-full" : ""}`}>
                            {t("roomLobby.slotsCount", {
                              active: slotAvailability.activeRooms,
                              max: slotAvailability.maxRooms
                            })}
                          </span>
                          <button
                            type="button"
                            className={`lobby-slot-refresh${refreshing ? " is-refreshing" : ""}`}
                            onClick={handleRefreshSlots}
                            title={t("roomLobby.refreshSlotCount")}
                          >
                            &#x21bb;
                          </button>
                        </span>
                      )}
                    </div>
                    <span>{slotsFull ? t("roomLobby.allSlotsInUse") : t("roomLobby.hostRoomShare")}</span>
                  </div>

                  <button
                    className="lobby-action-button lobby-create-button"
                    disabled={!canCreateRoom}
                  >
                    {t("roomLobby.createRoom")}
                  </button>
                </form>

                <form
                  className="lobby-action-card is-join"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleJoinRoom();
                  }}
                >
                  <div className="lobby-card-heading">
                    <h2>{t("roomLobby.joinByToken")}</h2>
                    <span>{t("roomLobby.joinByTokenDesc")}</span>
                  </div>

                  <label className="field lobby-field">
                    <span>{t("roomLobby.inviteTokenLabel")}</span>
                    <input
                      className="invite-token-input"
                      value={inviteValue}
                      onChange={(event) => setInviteValue(event.target.value)}
                      maxLength={INVITE_TOKEN_LENGTH}
                      placeholder={t("roomLobby.pasteInviteToken")}
                      spellCheck={false}
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                  </label>

                  <button
                    className={[
                      "lobby-action-button",
                      "lobby-join-button",
                      canJoinRoom ? "is-ready" : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    disabled={!canJoinRoom}
                  >
                    {t("roomLobby.joinMatch")}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="status-strip lobby-status-strip">
        <span className="lobby-status-note">{t("roomLobby.noAccountNeeded")}</span>
        {isP2PDeployment ? (
          <span className="lobby-status-note">
            {t("roomLobby.directMatchesStayInBrowser")}
          </span>
        ) : !canJoinRoom ? (
          <span className="lobby-status-note">{t("roomLobby.pasteInviteTokenToUnlock")}</span>
        ) : (
          <span className="lobby-status-note">{t("roomLobby.inviteLooksValid")}</span>
        )}
        {error ? <span className="error-text">{translateServerMessage(error)}</span> : null}
      </div>
    </section>
  );
};
