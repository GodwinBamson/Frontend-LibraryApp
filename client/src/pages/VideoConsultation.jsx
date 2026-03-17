// /* eslint-disable no-unused-vars */

// import { useEffect, useRef, useState, useMemo } from "react";
// import WebRTCService from "../utils/webrtc.js";
// import {
//   PhoneOff,
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   Volume2,
//   MessageCircle,
//   X,
//   Send,
//   Users,
//   MonitorUp,
//   MonitorDown,
//   Copy,
//   Check,
//   Maximize2,
//   Minimize2,
//   PhoneCall,
//   Video as VideoIcon,
//   User,
//   Paperclip,
//   Smile,
//   Trash2,
//   File,
//   Download,
//   CheckCheck,
//   Play,
//   Search,
//   Filter,
//   SortAsc,
//   SortDesc,
//   Wifi,
//   WifiOff,
//   RefreshCw,
// } from "lucide-react";

// const VideoConsultation = () => {
//   const [status, setStatus] = useState("Disconnected");
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [participants, setParticipants] = useState([]);
//   const [localVideoReady, setLocalVideoReady] = useState(false);
//   const [remoteStreams, setRemoteStreams] = useState({});
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [showChat, setShowChat] = useState(true);
//   const [showParticipants, setShowParticipants] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [audioLevel, setAudioLevel] = useState(0);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [connectionQuality, setConnectionQuality] = useState("good");
//   const [callType, setCallType] = useState(null);
//   const [availableStaff, setAvailableStaff] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState(null);
//   const [showStaffList, setShowStaffList] = useState(true);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [typingUsers, setTypingUsers] = useState({});
//   const [chatHistory, setChatHistory] = useState([]);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [chatMode, setChatMode] = useState("room");
//   const [showMessageOptions, setShowMessageOptions] = useState(null);
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSearch, setShowSearch] = useState(false);
//   const [filterType, setFilterType] = useState("all");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [selectedMessages, setSelectedMessages] = useState(new Set());
//   const [isSelectionMode, setIsSelectionMode] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [messageToDelete, setMessageToDelete] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState({});
//   const [isUploading, setIsUploading] = useState(false);
//   const [showMediaViewer, setShowMediaViewer] = useState(null);
//   const [isPlaying, setIsPlaying] = useState({});
//   const [volume, setVolume] = useState({});
//   const [isMuted, setIsMuted] = useState({});
//   const [playbackRate, setPlaybackRate] = useState({});
//   const [showReactions, setShowReactions] = useState(null);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [serverStatus, setServerStatus] = useState("checking");
//   const [showReconnect, setShowReconnect] = useState(false);
//   const [reconnecting, setReconnecting] = useState(false);
//   const [connectionAttempts, setConnectionAttempts] = useState(0);
//   const [transport, setTransport] = useState("unknown");

//   const localVideoRef = useRef();
//   const remoteVideosRef = useRef({});
//   const messagesEndRef = useRef();
//   const chatContainerRef = useRef();
//   const mainContainerRef = useRef();
//   const attachedStreamsRef = useRef(new Set());
//   const connectionTimeoutRef = useRef(null);
//   const reconnectAttemptsRef = useRef(0);
//   const typingTimeoutRef = useRef(null);
//   const fileInputRef = useRef();
//   const healthCheckIntervalRef = useRef(null);

//   // Emoji list
//   const emojis = [
//     "😀",
//     "😃",
//     "😄",
//     "😁",
//     "😆",
//     "😅",
//     "😂",
//     "🤣",
//     "😊",
//     "😇",
//     "🙂",
//     "🙃",
//     "😉",
//     "😌",
//     "😍",
//     "🥰",
//     "😘",
//     "😗",
//     "😙",
//     "😚",
//     "😋",
//     "😛",
//     "😝",
//     "😜",
//     "🤪",
//     "🤨",
//     "🧐",
//     "🤓",
//     "😎",
//     "🥸",
//     "🤩",
//     "🥳",
//     "😏",
//     "😒",
//     "😞",
//     "😔",
//     "😟",
//     "😕",
//     "🙁",
//     "☹️",
//     "😣",
//     "😖",
//     "😫",
//     "😩",
//     "🥺",
//     "😢",
//     "😭",
//     "😤",
//     "😠",
//     "😡",
//     "🤬",
//     "🤯",
//     "😳",
//     "🥵",
//     "🥶",
//     "😱",
//     "😨",
//     "😰",
//     "😥",
//     "😓",
//     "🤗",
//     "🤔",
//     "🤭",
//     "🤫",
//     "🤥",
//     "😶",
//     "😐",
//     "😑",
//     "😬",
//     "🙄",
//     "❤️",
//     "🧡",
//     "💛",
//     "💚",
//     "💙",
//     "💜",
//     "🖤",
//     "🤍",
//     "🤎",
//     "💔",
//   ];

//   const styles = `
//     .video-container {
//       background-color: #2d2d2d;
//       position: relative;
//       overflow: hidden;
//       contain: strict;
//       border-radius: 0.5rem;
//     }
    
//     .video-container video {
//       position: relative;
//       z-index: 1;
//       width: 100%;
//       height: 100%;
//       object-fit: cover;
//       background-color: #1a1a1a;
//       backface-visibility: hidden;
//       -webkit-backface-visibility: hidden;
//       transform: translateZ(0);
//       -webkit-transform: translateZ(0);
//       will-change: transform;
//       pointer-events: auto;
//     }
    
//     .video-overlay {
//       position: absolute;
//       bottom: 8px;
//       left: 8px;
//       right: 8px;
//       z-index: 10;
//       pointer-events: none;
//     }
    
//     .play-button-overlay {
//       position: absolute;
//       inset: 0;
//       z-index: 20;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background-color: rgba(0, 0, 0, 0.3);
//       opacity: 0;
//       transition: opacity 0.2s;
//       pointer-events: auto;
//     }
    
//     .play-button-overlay:hover {
//       opacity: 1;
//     }
    
//     .connection-indicator {
//       position: absolute;
//       top: 8px;
//       right: 8px;
//       width: 8px;
//       height: 8px;
//       border-radius: 50%;
//       z-index: 30;
//     }
    
//     .connection-good {
//       background-color: #10b981;
//       box-shadow: 0 0 8px #10b981;
//     }
    
//     .connection-poor {
//       background-color: #f59e0b;
//       box-shadow: 0 0 8px #f59e0b;
//     }
    
//     .connection-bad {
//       background-color: #ef4444;
//       box-shadow: 0 0 8px #ef4444;
//     }

//     .server-status {
//       position: fixed;
//       bottom: 20px;
//       right: 20px;
//       z-index: 1000;
//       background: #1f2937;
//       border-radius: 9999px;
//       padding: 8px 16px;
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
//     }

//     .server-status.online {
//       border-left: 4px solid #10b981;
//     }

//     .server-status.offline {
//       border-left: 4px solid #ef4444;
//     }

//     .server-status.checking {
//       border-left: 4px solid #f59e0b;
//     }

//     .reconnecting-overlay {
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       background: rgba(245, 158, 11, 0.9);
//       color: white;
//       text-align: center;
//       padding: 8px;
//       z-index: 9999;
//       animation: slideDown 0.3s ease;
//       backdrop-filter: blur(4px);
//     }

//     @keyframes slideDown {
//       from {
//         transform: translateY(-100%);
//       }
//       to {
//         transform: translateY(0);
//       }
//     }

//     .call-button {
//       transition: all 0.2s ease;
//     }
    
//     .call-button:hover {
//       transform: scale(1.05);
//     }
    
//     .call-button:active {
//       transform: scale(0.95);
//     }

//     .incoming-call-modal {
//       position: fixed;
//       top: 50%;
//       left: 50%;
//       transform: translate(-50%, -50%);
//       z-index: 1000;
//       animation: slideIn 0.3s ease;
//     }

//     @keyframes slideIn {
//       from {
//         transform: translate(-50%, -60%);
//         opacity: 0;
//       }
//       to {
//         transform: translate(-50%, -50%);
//         opacity: 1;
//       }
//     }

//     .chat-message {
//       transition: all 0.2s ease;
//       position: relative;
//     }
    
//     .chat-message:hover {
//       transform: translateX(2px);
//     }
    
//     .chat-message:hover .message-options {
//       opacity: 1;
//     }

//     .message-options {
//       position: absolute;
//       top: -20px;
//       right: 0;
//       opacity: 0;
//       transition: opacity 0.2s;
//       display: flex;
//       gap: 4px;
//       background: #374151;
//       border-radius: 9999px;
//       padding: 4px;
//       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//       z-index: 50;
//     }

//     .message-reactions {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 4px;
//       margin-top: 4px;
//     }

//     .reaction-badge {
//       background: #4b5563;
//       border-radius: 9999px;
//       padding: 2px 6px;
//       font-size: 11px;
//       display: inline-flex;
//       align-items: center;
//       gap: 2px;
//       cursor: pointer;
//       transition: all 0.2s;
//     }

//     .reaction-badge:hover {
//       background: #6b7280;
//       transform: scale(1.05);
//     }

//     .reaction-badge.active {
//       background: #3b82f6;
//     }

//     .emoji-picker {
//       position: absolute;
//       bottom: 100%;
//       left: 0;
//       background: #1f2937;
//       border-radius: 0.5rem;
//       padding: 8px;
//       box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
//       z-index: 100;
//       max-height: 300px;
//       overflow-y: auto;
//       display: grid;
//       grid-template-columns: repeat(8, 1fr);
//       gap: 4px;
//     }

//     .emoji-item {
//       cursor: pointer;
//       padding: 4px;
//       border-radius: 4px;
//       font-size: 20px;
//       transition: all 0.2s;
//     }

//     .emoji-item:hover {
//       background: #374151;
//       transform: scale(1.1);
//     }

//     .typing-indicator {
//       display: flex;
//       align-items: center;
//       gap: 4px;
//       padding: 8px 12px;
//       background: rgba(255, 255, 255, 0.1);
//       border-radius: 20px;
//       width: fit-content;
//     }

//     .typing-dot {
//       width: 8px;
//       height: 8px;
//       background: #9ca3af;
//       border-radius: 50%;
//       animation: typingBounce 1.4s infinite ease-in-out;
//     }

//     .typing-dot:nth-child(1) { animation-delay: 0s; }
//     .typing-dot:nth-child(2) { animation-delay: 0.2s; }
//     .typing-dot:nth-child(3) { animation-delay: 0.4s; }

//     @keyframes typingBounce {
//       0%, 60%, 100% { transform: translateY(0); }
//       30% { transform: translateY(-8px); }
//     }

//     .unread-badge {
//       position: absolute;
//       top: -5px;
//       right: -5px;
//       background: #ef4444;
//       color: white;
//       border-radius: 9999px;
//       min-width: 18px;
//       height: 18px;
//       font-size: 11px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       padding: 0 4px;
//     }

//     .reconnect-button {
//       animation: pulse 2s infinite;
//     }

//     @keyframes pulse {
//       0%, 100% { opacity: 1; }
//       50% { opacity: 0.5; }
//     }

//     .transport-badge {
//       font-size: 10px;
//       background: #374151;
//       padding: 2px 6px;
//       border-radius: 12px;
//       margin-left: 8px;
//     }
//   `;

//   // Health check function
//   const checkServerHealth = async () => {
//     try {
//       setServerStatus("checking");
//       const isHealthy = await WebRTCService.checkServerHealth();
//       setServerStatus(isHealthy ? "online" : "offline");

//       if (!isHealthy && !WebRTCService.isConnected()) {
//         setShowReconnect(true);
//         setError("Server is not responding. Please check your connection.");
//       } else {
//         setShowReconnect(false);
//         if (isHealthy && !WebRTCService.isConnected() && user) {
//           attemptReconnect();
//         }
//       }
//     } catch (error) {
//       console.error("Health check error:", error);
//       setServerStatus("offline");
//       setShowReconnect(true);
//     }
//   };

//   // Reconnection function
//   const attemptReconnect = () => {
//     if (!user || reconnecting) return;

//     setReconnecting(true);
//     setError("Attempting to reconnect...");
//     setConnectionAttempts((prev) => prev + 1);

//     // Disconnect existing socket
//     WebRTCService.disconnect();

//     // Reinitialize
//     const userId = user._id || user.id || user.userId;
//     const username = user.username || user.name || user.email || "User";

//     setTimeout(() => {
//       WebRTCService.initialize(userId, username, user.role);
//       setReconnecting(false);
//       setError(null);
//     }, 2000);
//   };

//   // Get user from localStorage
//   useEffect(() => {
//     try {
//       const userStr = localStorage.getItem("user");
//       if (userStr) {
//         const parsedUser = JSON.parse(userStr);
//         const normalizedUser = {
//           ...parsedUser,
//           username:
//             parsedUser.username ||
//             parsedUser.name ||
//             parsedUser.email ||
//             "User",
//           userId: parsedUser._id || parsedUser.id || parsedUser.userId,
//           role: parsedUser.role || "patient",
//         };
//         setUser(normalizedUser);
//         console.log("User loaded:", normalizedUser);
//       }
//     } catch (error) {
//       console.error("Error parsing user from localStorage:", error);
//     }
//   }, []);

//   // Initialize WebRTC and set up callbacks
//   useEffect(() => {
//     if (!user) return;

//     const userId = user._id || user.id || user.userId;
//     if (!userId) {
//       setError("Invalid user data. Please log in again.");
//       return;
//     }

//     const username = user.username || user.name || user.email || "User";

//     console.log("Initializing WebRTC with:", {
//       userId,
//       username,
//       role: user.role,
//     });

//     // Initialize WebRTC service
//     WebRTCService.initialize(userId, username, user.role);
//     setIsInitialized(true);

//     // Start health checks
//     checkServerHealth();
//     healthCheckIntervalRef.current = setInterval(checkServerHealth, 30000);

//     // Check for pending call
//     if (WebRTCService.hasPendingCall && WebRTCService.hasPendingCall()) {
//       const pendingCall = WebRTCService.getPendingCall();
//       if (pendingCall) {
//         setIncomingCall(pendingCall);
//       }
//     }

//     // Set up callbacks
//     WebRTCService.onIncomingCall = (callData) => {
//       console.log("📞 Incoming call received:", callData);
//       setIncomingCall(callData);
//     };

//     WebRTCService.onConnectionStateChange = ({ state, data }) => {
//       setStatus(`${state} ${data ? `- ${data}` : ""}`);

//       if (state === "connected") {
//         setIsConnecting(false);
//         setError(null);
//         reconnectAttemptsRef.current = 0;
//         setShowReconnect(false);
//         // Get transport type
//         if (WebRTCService.socket && WebRTCService.socket.io) {
//           setTransport(WebRTCService.socket.io.engine.transport.name);
//         }
//       } else if (state === "error") {
//         setError(data);
//         setIsConnecting(false);
//         setShowReconnect(true);
//       } else if (state === "disconnected") {
//         setShowReconnect(true);
//       } else if (state === "room_joined") {
//         if (WebRTCService.socket) {
//           WebRTCService.socket.emit("request-chat-history", data);
//         }
//       }
//     };

//     WebRTCService.onUserJoined = (userData) => {
//       setParticipants((prev) => [...prev, userData]);
//       addSystemMessage(`👋 ${userData.username} joined the consultation`);
//     };

//     WebRTCService.onUserLeft = (userData) => {
//       setParticipants((prev) =>
//         prev.filter((p) => p.userId !== userData.userId),
//       );
//       setRemoteStreams((prev) => {
//         const newStreams = { ...prev };
//         delete newStreams[userData.userId];
//         return newStreams;
//       });
//       attachedStreamsRef.current.delete(userData.userId);
//       addSystemMessage(`👋 ${userData.username} left the consultation`);
//     };

//     WebRTCService.onRemoteStream = (userId, stream) => {
//       setRemoteStreams((prev) => {
//         if (prev[userId] && prev[userId].id === stream.id) {
//           return prev;
//         }
//         return { ...prev, [userId]: stream };
//       });
//     };

//     WebRTCService.onMessageReceived = (message) => {
//       setMessages((prev) => {
//         const current = Array.isArray(prev) ? prev : [];
//         return [...current, message];
//       });
//       scrollToBottom();

//       if (!showChat) {
//         setUnreadCount((prev) => prev + 1);
//       }
//     };

//     WebRTCService.onDirectMessageReceived = (message) => {
//       setMessages((prev) => {
//         const current = Array.isArray(prev) ? prev : [];
//         return [...current, { ...message, private: true }];
//       });
//       scrollToBottom();

//       if (!showChat) {
//         setUnreadCount((prev) => prev + 1);
//       }
//     };

//     WebRTCService.onAudioLevelChange = (level) => {
//       setAudioLevel(level);
//     };

//     WebRTCService.onCallRejected = (from, callType) => {
//       setIsConnecting(false);
//       setShowStaffList(true);
//       setSelectedStaff(null);
//       addSystemMessage(`❌ Call rejected by ${from.username}`);
//     };

//     WebRTCService.onStaffListUpdate = (staffList) => {
//       console.log("Staff list updated:", staffList);
//       setAvailableStaff(Array.isArray(staffList) ? staffList : []);
//     };

//     const socket = WebRTCService.socket;
//     if (socket) {
//       socket.on("user-typing", ({ userId, username, isTyping }) => {
//         setTypingUsers((prev) => ({
//           ...prev,
//           [userId]: isTyping ? username : null,
//         }));

//         if (isTyping) {
//           setTimeout(() => {
//             setTypingUsers((prev) => ({
//               ...prev,
//               [userId]: null,
//             }));
//           }, 3000);
//         }
//       });

//       socket.on("chat-history", (history) => {
//         const historyArray = Array.isArray(history) ? history : [];
//         setChatHistory(historyArray);
//         setMessages(historyArray);
//       });

//       socket.on("message-reaction", ({ messageId, reaction, userId }) => {
//         setMessages((prev) => {
//           const current = Array.isArray(prev) ? prev : [];
//           return current.map((msg) => {
//             if (msg?.id === messageId) {
//               const reactions = msg.reactions || {};
//               if (!reactions[reaction]) reactions[reaction] = [];

//               if (reactions[reaction].includes(userId)) {
//                 reactions[reaction] = reactions[reaction].filter(
//                   (id) => id !== userId,
//                 );
//               } else {
//                 reactions[reaction] = [...reactions[reaction], userId];
//               }

//               return { ...msg, reactions };
//             }
//             return msg;
//           });
//         });
//       });

//       socket.on("message-deleted", ({ messageId }) => {
//         setMessages((prev) => {
//           const current = Array.isArray(prev) ? prev : [];
//           return current.filter((msg) => msg?.id !== messageId);
//         });
//       });

//       socket.on("chat-cleared", ({ roomId }) => {
//         setMessages([]);
//         addSystemMessage("🧹 Chat history cleared");
//       });
//     }

//     return () => {
//       if (connectionTimeoutRef.current) {
//         clearTimeout(connectionTimeoutRef.current);
//       }
//       if (healthCheckIntervalRef.current) {
//         clearInterval(healthCheckIntervalRef.current);
//       }
//       leaveCall();
//       WebRTCService.disconnect();
//       attachedStreamsRef.current.clear();
//     };
//   }, [user]);

//   // Socket event listeners for connection monitoring
//   useEffect(() => {
//     if (!WebRTCService.socket) return;

//     const handleConnectError = (error) => {
//       console.error("Socket connection error:", error);
//       setError(`Connection error: ${error.message}. Retrying...`);
//       setShowReconnect(true);

//       // Force transport to polling if websocket fails
//       if (WebRTCService.socket && WebRTCService.socket.io) {
//         WebRTCService.socket.io.opts.transports = ["polling"];
//       }
//     };

//     const handleReconnectAttempt = (attempt) => {
//       console.log(`Reconnection attempt ${attempt}`);
//       setStatus(`Reconnecting... (attempt ${attempt})`);
//       setConnectionAttempts(attempt);
//     };

//     const handleReconnect = () => {
//       console.log("Reconnected successfully");
//       setStatus("Connected");
//       setError(null);
//       setShowReconnect(false);
//       if (WebRTCService.socket && WebRTCService.socket.io) {
//         setTransport(WebRTCService.socket.io.engine.transport.name);
//       }
//     };

//     const handleTransport = (transport) => {
//       console.log("Transport changed to:", transport);
//       setTransport(transport);
//     };

//     WebRTCService.socket.on("connect_error", handleConnectError);
//     WebRTCService.socket.on("reconnect_attempt", handleReconnectAttempt);
//     WebRTCService.socket.on("reconnect", handleReconnect);

//     if (WebRTCService.socket.io) {
//       WebRTCService.socket.io.engine.on("transport", handleTransport);
//     }

//     return () => {
//       if (WebRTCService.socket) {
//         WebRTCService.socket.off("connect_error", handleConnectError);
//         WebRTCService.socket.off("reconnect_attempt", handleReconnectAttempt);
//         WebRTCService.socket.off("reconnect", handleReconnect);
//         if (WebRTCService.socket.io) {
//           WebRTCService.socket.io.engine.off("transport", handleTransport);
//         }
//       }
//     };
//   }, [WebRTCService.socket]);

//   // Debug messages state
//   useEffect(() => {
//     console.log("📨 Messages state:", {
//       isArray: Array.isArray(messages),
//       length: Array.isArray(messages) ? messages.length : "N/A",
//       type: typeof messages,
//     });
//   }, [messages]);

//   // Check connection quality
//   useEffect(() => {
//     if (
//       !WebRTCService.peerConnections ||
//       WebRTCService.peerConnections.size === 0
//     )
//       return;

//     const checkConnectionQuality = setInterval(() => {
//       let worstQuality = "good";

//       WebRTCService.peerConnections.forEach((pc) => {
//         if (
//           pc.iceConnectionState === "connected" ||
//           pc.iceConnectionState === "completed"
//         ) {
//           if (pc.getStats) {
//             pc.getStats().then((stats) => {
//               stats.forEach((report) => {
//                 if (report.type === "inbound-rtp" && report.kind === "video") {
//                   if (report.packetsLost > 10) {
//                     worstQuality = "poor";
//                   }
//                   if (report.packetsLost > 50) {
//                     worstQuality = "bad";
//                   }
//                 }
//               });
//             });
//           }
//         } else if (
//           pc.iceConnectionState === "failed" ||
//           pc.iceConnectionState === "disconnected"
//         ) {
//           worstQuality = "bad";
//         } else if (pc.iceConnectionState === "checking") {
//           worstQuality = "poor";
//         }
//       });

//       setConnectionQuality(worstQuality);
//     }, 5000);

//     return () => clearInterval(checkConnectionQuality);
//   }, [remoteStreams]);

//   // Attach local stream to video element
//   useEffect(() => {
//     const checkAndAttachStream = () => {
//       if (!localVideoRef.current) {
//         return false;
//       }

//       const stream = WebRTCService.localStream;
//       if (!stream) {
//         return false;
//       }

//       if (
//         !localVideoRef.current.srcObject ||
//         localVideoRef.current.srcObject.id !== stream.id
//       ) {
//         localVideoRef.current.srcObject = stream;

//         localVideoRef.current
//           .play()
//           .then(() => {
//             setLocalVideoReady(true);
//           })
//           .catch(() => {
//             setLocalVideoReady(true);
//           });
//       } else {
//         setLocalVideoReady(true);
//       }

//       return true;
//     };

//     if (!checkAndAttachStream()) {
//       const interval = setInterval(() => {
//         if (checkAndAttachStream()) {
//           clearInterval(interval);
//         }
//       }, 500);

//       setTimeout(() => clearInterval(interval), 10000);

//       return () => clearInterval(interval);
//     }
//   }, [WebRTCService.localStream]);

//   // Attach remote streams to video elements
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       Object.entries(remoteStreams).forEach(([userId, stream]) => {
//         const videoEl = remoteVideosRef.current[userId];
//         if (videoEl && stream) {
//           if (
//             stream.active &&
//             (!videoEl.srcObject || videoEl.srcObject.id !== stream.id)
//           ) {
//             videoEl.srcObject = stream;
//             attachedStreamsRef.current.add(userId);
//           }

//           if (videoEl.paused && videoEl.readyState >= 2) {
//             videoEl
//               .play()
//               .then(() => {
//                 const playBtn = document.getElementById(`play-btn-${userId}`);
//                 if (playBtn) playBtn.style.opacity = "0";
//               })
//               .catch(() => {
//                 const playBtn = document.getElementById(`play-btn-${userId}`);
//                 if (playBtn) playBtn.style.opacity = "1";
//               });
//           }
//         }
//       });
//     }, 100);

//     return () => clearTimeout(timeout);
//   }, [remoteStreams]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Reset unread count when chat is opened
//   useEffect(() => {
//     if (showChat) {
//       setUnreadCount(0);
//     }
//   }, [showChat]);

//   // Filter and sort messages
//   const filteredMessages = useMemo(() => {
//     const messagesArray = Array.isArray(messages) ? messages : [];

//     return messagesArray
//       .filter((msg) => {
//         if (!msg) return false;
//         if (filterType === "text") return msg.type === "text" && !msg.system;
//         if (filterType === "media") return msg.type !== "text" && !msg.system;
//         if (filterType === "system") return msg.system;
//         return true;
//       })
//       .filter((msg) => {
//         if (!searchQuery) return true;
//         return (
//           msg.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           msg.sender?.username
//             ?.toLowerCase()
//             .includes(searchQuery.toLowerCase())
//         );
//       })
//       .sort((a, b) => {
//         const timeA = new Date(a.timestamp || 0).getTime();
//         const timeB = new Date(b.timestamp || 0).getTime();
//         return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
//       });
//   }, [messages, filterType, searchQuery, sortOrder]);

//   const addSystemMessage = (text) => {
//     const message = {
//       id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       text,
//       system: true,
//       type: "system",
//       timestamp: new Date().toISOString(),
//     };
//     setMessages((prev) => {
//       const current = Array.isArray(prev) ? prev : [];
//       return [...current, message];
//     });
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const startCall = async (staff, type) => {
//     if (!staff) {
//       setError("Please select a staff member");
//       return;
//     }

//     if (serverStatus === "offline") {
//       setError("Server is offline. Please check your connection.");
//       return;
//     }

//     try {
//       setIsConnecting(true);
//       setError(null);
//       setCallType(type);
//       setSelectedStaff(staff);
//       setShowStaffList(false);
//       setMessages([]);

//       setStatus(`Calling ${staff.username}...`);

//       await WebRTCService.startCall(staff.userId, type);

//       setStatus(`In call with ${staff.username}`);
//       addSystemMessage(
//         `${type === "audio" ? "🎧" : "📹"} Started ${type} call with ${staff.username}`,
//       );
//     } catch (error) {
//       console.error("Failed to start call:", error);
//       setError(error.message);
//       setIsConnecting(false);
//       setShowStaffList(true);
//       setSelectedStaff(null);
//     }
//   };

//   const acceptCall = async () => {
//     if (!incomingCall) return;

//     if (serverStatus === "offline") {
//       setError("Server is offline. Please check your connection.");
//       return;
//     }

//     try {
//       setIsConnecting(true);
//       setError(null);
//       setCallType(incomingCall.callType);
//       setSelectedStaff(incomingCall.from);
//       setShowStaffList(false);
//       setMessages([]);

//       setStatus(`Accepting call from ${incomingCall.from.username}...`);

//       await WebRTCService.acceptCall(
//         incomingCall.roomId,
//         incomingCall.callType,
//       );

//       setStatus(`In call with ${incomingCall.from.username}`);
//       setIncomingCall(null);
//       addSystemMessage(
//         `${incomingCall.callType === "audio" ? "🎧" : "📹"} Accepted ${incomingCall.callType} call from ${incomingCall.from.username}`,
//       );
//     } catch (error) {
//       console.error("Failed to accept call:", error);
//       setError(error.message);
//       setIsConnecting(false);
//       setIncomingCall(null);
//     }
//   };

//   const rejectCall = () => {
//     if (incomingCall) {
//       WebRTCService.rejectCall(incomingCall.from.userId, incomingCall.callType);
//       setIncomingCall(null);
//       addSystemMessage(`❌ Rejected call from ${incomingCall.from.username}`);
//     }
//   };

//   const leaveCall = () => {
//     WebRTCService.leaveRoom();
//     setStatus("Disconnected");
//     setParticipants([]);
//     setRemoteStreams({});
//     setMessages([]);
//     setChatHistory([]);
//     setIsConnecting(false);
//     setCallType(null);
//     setSelectedStaff(null);
//     setShowStaffList(true);
//     setIncomingCall(null);
//     setTypingUsers({});
//     attachedStreamsRef.current.clear();
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() && !replyingTo) return;

//     if (!WebRTCService.isConnected()) {
//       setError("Not connected to server. Please wait for reconnection.");
//       return;
//     }

//     let message;

//     if (WebRTCService.currentRoom) {
//       message = WebRTCService.sendMessage(newMessage, "text");
//     } else if (selectedStaff) {
//       try {
//         message = WebRTCService.sendDirectMessage(
//           selectedStaff.userId,
//           newMessage,
//           "text",
//         );

//         message = {
//           ...message,
//           sender: {
//             userId: user._id || user.id,
//             username: user.username,
//             role: user.role,
//           },
//         };
//       } catch (error) {
//         console.error("Failed to send direct message:", error);
//         setError("Failed to send message");
//       }
//     }

//     if (message) {
//       setMessages((prev) => {
//         const current = Array.isArray(prev) ? prev : [];
//         return [...current, message];
//       });
//     }

//     setNewMessage("");
//     setReplyingTo(null);
//     scrollToBottom();

//     handleTyping(false);
//   };

//   const handleTyping = (isTyping) => {
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     const socket = WebRTCService.socket;
//     if (socket && WebRTCService.currentRoom) {
//       socket.emit("typing", {
//         roomId: WebRTCService.currentRoom,
//         isTyping,
//       });

//       if (isTyping) {
//         typingTimeoutRef.current = setTimeout(() => {
//           socket.emit("typing", {
//             roomId: WebRTCService.currentRoom,
//             isTyping: false,
//           });
//         }, 3000);
//       }
//     }
//   };

//   const addEmoji = (emoji) => {
//     setNewMessage((prev) => prev + emoji);
//     setShowEmojiPicker(false);
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setIsUploading(true);
//     setUploadProgress({ [file.name]: 0 });

//     const interval = setInterval(() => {
//       setUploadProgress((prev) => ({
//         ...prev,
//         [file.name]: Math.min((prev[file.name] || 0) + 10, 100),
//       }));
//     }, 500);

//     try {
//       const mediaUrl = URL.createObjectURL(file);

//       const fileType = file.type.startsWith("image/")
//         ? "image"
//         : file.type.startsWith("video/")
//           ? "video"
//           : file.type.startsWith("audio/")
//             ? "audio"
//             : "file";

//       let message;
//       if (WebRTCService.currentRoom) {
//         message = WebRTCService.sendMessage(file.name, fileType, mediaUrl);
//       } else if (selectedStaff) {
//         message = WebRTCService.sendDirectMessage(
//           selectedStaff.userId,
//           file.name,
//           fileType,
//           mediaUrl,
//         );
//       }

//       if (message) {
//         setMessages((prev) => {
//           const current = Array.isArray(prev) ? prev : [];
//           return [...current, message];
//         });
//       }

//       clearInterval(interval);
//       setUploadProgress({});
//     } catch (error) {
//       console.error("File upload error:", error);
//       setError("Failed to upload file");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const addReaction = (messageId, reaction) => {
//     WebRTCService.addReaction(messageId, reaction);
//     setShowReactions(null);
//   };

//   const deleteMessage = (messageId) => {
//     WebRTCService.deleteMessage(messageId);
//     setShowMessageOptions(null);
//     setMessageToDelete(null);
//     setShowDeleteConfirm(false);
//   };

//   const clearChat = () => {
//     if (WebRTCService.socket) {
//       WebRTCService.socket.emit("clear-chat", {
//         roomId: WebRTCService.currentRoom,
//         userId: user._id || user.id,
//       });
//     }
//     WebRTCService.clearMessages(WebRTCService.currentRoom);
//     setMessages([]);
//     setShowDeleteConfirm(false);
//   };

//   const toggleMessageSelection = (messageId) => {
//     const newSelection = new Set(selectedMessages);
//     if (newSelection.has(messageId)) {
//       newSelection.delete(messageId);
//     } else {
//       newSelection.add(messageId);
//     }
//     setSelectedMessages(newSelection);
//   };

//   const deleteSelectedMessages = () => {
//     selectedMessages.forEach((id) => deleteMessage(id));
//     setSelectedMessages(new Set());
//     setIsSelectionMode(false);
//   };

//   const exportChat = () => {
//     const messagesArray = Array.isArray(messages) ? messages : [];
//     const chatText = messagesArray
//       .map((msg) => {
//         const time = new Date(msg.timestamp).toLocaleString();
//         if (msg.system) return `[${time}] SYSTEM: ${msg.text}`;
//         return `[${time}] ${msg.sender?.username}: ${msg.text}`;
//       })
//       .join("\n");

//     const blob = new Blob([chatText], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `chat-${new Date().toISOString()}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const copyMessage = (text) => {
//     navigator.clipboard.writeText(text);
//     setShowMessageOptions(null);
//   };

//   const toggleAudio = () => {
//     const newState = !isAudioEnabled;
//     WebRTCService.toggleAudio(newState);
//     setIsAudioEnabled(newState);
//   };

//   const toggleVideo = () => {
//     const newState = !isVideoEnabled;
//     WebRTCService.toggleVideo(newState);
//     setIsVideoEnabled(newState);
//   };

//   const setAudioOnlyMode = () => {
//     if (isVideoEnabled) {
//       WebRTCService.toggleVideo(false);
//       setIsVideoEnabled(false);
//     }

//     if (!isAudioEnabled) {
//       WebRTCService.toggleAudio(true);
//       setIsAudioEnabled(true);
//     }

//     addSystemMessage("🎧 Switched to audio-only mode");
//   };

//   const toggleScreenShare = async () => {
//     try {
//       if (!isScreenSharing) {
//         await WebRTCService.startScreenShare();
//         setIsScreenSharing(true);
//         addSystemMessage("🖥️ Started screen sharing");
//       } else {
//         await WebRTCService.stopScreenShare();
//         setIsScreenSharing(false);
//         addSystemMessage("🖥️ Stopped screen sharing");
//       }
//     } catch (error) {
//       console.error("Screen share error:", error);
//       setError(error.message);
//     }
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       mainContainerRef.current?.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   const getGridLayout = () => {
//     const totalVideos = 1 + Object.keys(remoteStreams).length;

//     if (totalVideos <= 2) return "grid-cols-1 md:grid-cols-2";
//     if (totalVideos <= 4) return "grid-cols-1 md:grid-cols-2";
//     if (totalVideos <= 6) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
//     return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
//   };

//   const renderMessageContent = (msg) => {
//     if (!msg) return null;

//     if (msg.type === "image") {
//       return (
//         <div>
//           <img
//             src={msg.mediaUrl}
//             alt={msg.text}
//             className="message-media"
//             onClick={() => setShowMediaViewer(msg.mediaUrl)}
//           />
//           {msg.text && <p className="text-sm mt-1">{msg.text}</p>}
//         </div>
//       );
//     }

//     if (msg.type === "video") {
//       return (
//         <div>
//           <video
//             src={msg.mediaUrl}
//             className="message-media"
//             controls
//             onClick={() => setShowMediaViewer(msg.mediaUrl)}
//           />
//           {msg.text && <p className="text-sm mt-1">{msg.text}</p>}
//         </div>
//       );
//     }

//     if (msg.type === "audio") {
//       return (
//         <div>
//           <audio src={msg.mediaUrl} controls className="w-full" />
//           {msg.text && <p className="text-sm mt-1">{msg.text}</p>}
//         </div>
//       );
//     }

//     if (msg.type === "file") {
//       return (
//         <div className="flex items-center space-x-2">
//           <File size={20} />
//           <a
//             href={msg.mediaUrl}
//             download={msg.text}
//             className="text-sm underline"
//           >
//             {msg.text}
//           </a>
//         </div>
//       );
//     }

//     return <p className="text-sm break-words">{msg.text}</p>;
//   };

//   const renderReactions = (msg) => {
//     if (!msg || !msg.reactions) return null;

//     const reactions = Object.entries(msg.reactions).filter(
//       ([_, users]) => users && users.length > 0,
//     );

//     if (reactions.length === 0) return null;

//     return (
//       <div className="message-reactions">
//         {reactions.map(([reaction, users]) => (
//           <span
//             key={reaction}
//             className={`reaction-badge ${users.includes(user?._id || user?.id) ? "active" : ""}`}
//             onClick={() => addReaction(msg.id, reaction)}
//           >
//             {reaction} {users.length}
//           </span>
//         ))}
//       </div>
//     );
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">
//             Authentication Required
//           </h2>
//           <p className="text-gray-600">
//             Please log in to access video consultation
//           </p>
//           <button
//             onClick={() => (window.location.href = "/")}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{styles}</style>

//       {/* Reconnecting Banner */}
//       {status.includes("Reconnecting") && (
//         <div className="reconnecting-overlay">
//           <div className="flex items-center justify-center space-x-2">
//             <RefreshCw size={16} className="animate-spin" />
//             <span>{status}</span>
//             {connectionAttempts > 0 && (
//               <span className="text-xs bg-yellow-700 px-2 py-1 rounded">
//                 Attempt {connectionAttempts}/15
//               </span>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Server Status Indicator */}
//       <div className={`server-status ${serverStatus}`}>
//         {serverStatus === "online" ? (
//           <Wifi size={16} className="text-green-500" />
//         ) : serverStatus === "offline" ? (
//           <WifiOff size={16} className="text-red-500" />
//         ) : (
//           <RefreshCw size={16} className="text-yellow-500 animate-spin" />
//         )}
//         <span className="text-white text-sm">
//           Server:{" "}
//           {serverStatus === "online"
//             ? "Online"
//             : serverStatus === "offline"
//               ? "Offline"
//               : "Checking..."}
//         </span>
//         {transport !== "unknown" && (
//           <span className="transport-badge text-gray-300">{transport}</span>
//         )}
//         {showReconnect && (
//           <button
//             onClick={attemptReconnect}
//             disabled={reconnecting}
//             className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 reconnect-button"
//           >
//             {reconnecting ? "Reconnecting..." : "Reconnect"}
//           </button>
//         )}
//       </div>

//       {/* Loading State */}
//       {!isInitialized && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
//           <div className="bg-gray-800 rounded-lg p-8 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-white">Initializing video consultation...</p>
//           </div>
//         </div>
//       )}

//       {/* Incoming Call Modal */}
//       {incomingCall && (
//         <div className="incoming-call-modal bg-gray-800 rounded-lg p-6 shadow-2xl border-2 border-purple-500">
//           <div className="text-center">
//             <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
//               {incomingCall.callType === "audio" ? (
//                 <PhoneCall size={40} className="text-white" />
//               ) : (
//                 <VideoIcon size={40} className="text-white" />
//               )}
//             </div>
//             <h3 className="text-xl text-white font-semibold mb-2">
//               Incoming {incomingCall.callType} Call
//             </h3>
//             <p className="text-gray-300 mb-4">
//               From: {incomingCall.from.username} ({incomingCall.from.role})
//             </p>
//             <div className="flex space-x-3 justify-center">
//               <button
//                 onClick={acceptCall}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Accept
//               </button>
//               <button
//                 onClick={rejectCall}
//                 className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Media Viewer */}
//       {showMediaViewer && (
//         <div className="media-viewer" onClick={() => setShowMediaViewer(null)}>
//           <div className="media-viewer-content">
//             {showMediaViewer.match(/\.(jpeg|jpg|gif|png)$/i) ? (
//               <img
//                 src={showMediaViewer}
//                 alt="Media"
//                 className="max-w-full max-h-full"
//               />
//             ) : (
//               <video
//                 src={showMediaViewer}
//                 controls
//                 autoPlay
//                 className="max-w-full max-h-full"
//               />
//             )}
//           </div>
//           <button
//             className="media-viewer-close"
//             onClick={() => setShowMediaViewer(null)}
//           >
//             <X size={24} />
//           </button>
//         </div>
//       )}

//       {/* Selection Mode Toolbar */}
//       {isSelectionMode && (
//         <div className="selection-mode">
//           <span className="text-white text-sm">
//             {selectedMessages.size} selected
//           </span>
//           <button
//             onClick={deleteSelectedMessages}
//             className="text-red-500 hover:text-red-400"
//             disabled={selectedMessages.size === 0}
//           >
//             <Trash2 size={18} />
//           </button>
//           <button
//             onClick={() => {
//               setIsSelectionMode(false);
//               setSelectedMessages(new Set());
//             }}
//             className="text-gray-400 hover:text-white"
//           >
//             <X size={18} />
//           </button>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
//           <div className="bg-gray-800 rounded-lg p-6 max-w-md">
//             <h3 className="text-xl text-white font-semibold mb-4">
//               Delete Message
//             </h3>
//             <p className="text-gray-300 mb-6">
//               Are you sure you want to delete this message?
//             </p>
//             <div className="flex space-x-3 justify-end">
//               <button
//                 onClick={() => {
//                   if (messageToDelete === "all") {
//                     clearChat();
//                   } else if (messageToDelete) {
//                     deleteMessage(messageToDelete);
//                   }
//                 }}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={() => {
//                   setShowDeleteConfirm(false);
//                   setMessageToDelete(null);
//                 }}
//                 className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div
//         ref={mainContainerRef}
//         className="h-screen bg-gray-900 flex flex-col"
//       >
//         <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-lg font-semibold">Video Consultation</h1>
//             <div className="flex items-center space-x-2">
//               <div
//                 className={`w-2 h-2 rounded-full ${WebRTCService.isConnected() ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
//               />
//               <span className="text-sm text-gray-300">{status}</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             {WebRTCService.currentRoom && selectedStaff && (
//               <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-1">
//                 <span className="text-sm">
//                   In call with: {selectedStaff.username}
//                 </span>
//               </div>
//             )}

//             <button
//               onClick={() => setShowParticipants(!showParticipants)}
//               className={`p-2 rounded-lg transition-colors relative ${
//                 showParticipants ? "bg-blue-600" : "hover:bg-gray-700"
//               }`}
//               title="Participants"
//             >
//               <Users size={18} />
//               {participants.length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//                   {participants.length + 1}
//                 </span>
//               )}
//             </button>

//             <button
//               onClick={() => setShowChat(!showChat)}
//               className={`p-2 rounded-lg transition-colors relative ${
//                 showChat ? "bg-blue-600" : "hover:bg-gray-700"
//               }`}
//               title="Chat"
//             >
//               <MessageCircle size={18} />
//               {unreadCount > 0 && !showChat && (
//                 <span className="unread-badge">{unreadCount}</span>
//               )}
//             </button>

//             <button
//               onClick={toggleFullscreen}
//               className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
//               title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
//             >
//               {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
//             </button>
//           </div>
//         </div>

//         <div className="flex-1 flex overflow-hidden">
//           <div
//             className={`flex-1 p-4 transition-all duration-300 ${
//               showChat ? "mr-80" : ""
//             }`}
//           >
//             {!WebRTCService.currentRoom ? (
//               <div className="h-full flex items-center justify-center">
//                 <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
//                   <h2 className="text-xl text-white font-semibold mb-4">
//                     Start a Consultation
//                   </h2>

//                   {error && (
//                     <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
//                       {error}
//                     </div>
//                   )}

//                   {serverStatus === "offline" && (
//                     <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-200 rounded-lg">
//                       Server is offline. Please check your connection and try
//                       again.
//                       <button
//                         onClick={attemptReconnect}
//                         disabled={reconnecting}
//                         className="ml-2 px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 disabled:opacity-50"
//                       >
//                         {reconnecting ? "Reconnecting..." : "Reconnect"}
//                       </button>
//                     </div>
//                   )}

//                   <div className="mb-4 p-3 bg-gray-700 rounded-lg">
//                     <p className="text-sm text-gray-300">
//                       <span className="font-semibold">You:</span>{" "}
//                       {user.username} ({user.role})
//                     </p>
//                     {transport !== "unknown" && (
//                       <p className="text-xs text-gray-400 mt-1">
//                         Connection: {transport}
//                       </p>
//                     )}
//                   </div>

//                   {showStaffList && (
//                     <div className="mb-4">
//                       <h3 className="text-white font-semibold mb-3">
//                         Available Staff ({availableStaff.length})
//                       </h3>

//                       {availableStaff.length === 0 ? (
//                         <div className="text-center py-8">
//                           <User
//                             size={48}
//                             className="mx-auto text-gray-500 mb-3"
//                           />
//                           <p className="text-gray-400">
//                             No staff available at the moment
//                           </p>
//                           <p className="text-xs text-gray-500 mt-2">
//                             Please wait or try again later
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="space-y-2 max-h-96 overflow-y-auto">
//                           {availableStaff
//                             .filter(
//                               (staff) => staff.userId !== (user._id || user.id),
//                             )
//                             .map((staff) => (
//                               <div
//                                 key={staff.userId}
//                                 className="bg-gray-700 rounded-lg p-3"
//                               >
//                                 <div className="flex items-center space-x-3 mb-2">
//                                   <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
//                                     {staff.username[0].toUpperCase()}
//                                   </div>
//                                   <div className="flex-1">
//                                     <p className="text-white font-medium">
//                                       {staff.username}
//                                     </p>
//                                     <p className="text-xs text-gray-400">
//                                       {staff.role}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="flex space-x-2">
//                                   <button
//                                     onClick={() => {
//                                       setSelectedStaff(staff);
//                                       setShowStaffList(false);
//                                       setChatMode("private");
//                                     }}
//                                     disabled={serverStatus === "offline"}
//                                     className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
//                                   >
//                                     <MessageCircle size={16} />
//                                     <span>Chat</span>
//                                   </button>
//                                   <button
//                                     onClick={() => startCall(staff, "audio")}
//                                     disabled={
//                                       isConnecting || serverStatus === "offline"
//                                     }
//                                     className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-1"
//                                   >
//                                     <PhoneCall size={16} />
//                                     <span>Audio</span>
//                                   </button>
//                                   <button
//                                     onClick={() => startCall(staff, "video")}
//                                     disabled={
//                                       isConnecting || serverStatus === "offline"
//                                     }
//                                     className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-1"
//                                   >
//                                     <VideoIcon size={16} />
//                                     <span>Video</span>
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {selectedStaff &&
//                     chatMode === "private" &&
//                     !WebRTCService.currentRoom && (
//                       <div className="mt-4 p-3 bg-gray-700 rounded-lg">
//                         <div className="flex items-center justify-between mb-3">
//                           <p className="text-white font-medium">
//                             Chatting with: {selectedStaff.username}
//                           </p>
//                           <button
//                             onClick={() => {
//                               setSelectedStaff(null);
//                               setChatMode("room");
//                               setMessages([]);
//                             }}
//                             className="text-gray-400 hover:text-white"
//                           >
//                             <X size={16} />
//                           </button>
//                         </div>

//                         <div className="h-64 overflow-y-auto mb-3 p-2 bg-gray-800 rounded-lg">
//                           {filteredMessages
//                             .filter((m) => !m.system)
//                             .map((msg) => (
//                               <div
//                                 key={msg.id}
//                                 className={`mb-2 ${msg.sender?.userId === (user._id || user.id) ? "text-right" : "text-left"}`}
//                               >
//                                 <div
//                                   className={`inline-block max-w-[80%] px-3 py-2 rounded-lg ${
//                                     msg.sender?.userId === (user._id || user.id)
//                                       ? "bg-blue-600 text-white"
//                                       : "bg-gray-600 text-white"
//                                   }`}
//                                 >
//                                   {msg.sender?.userId !==
//                                     (user._id || user.id) && (
//                                     <p className="text-xs font-semibold mb-1 text-gray-200">
//                                       {msg.sender?.username}
//                                     </p>
//                                   )}
//                                   {renderMessageContent(msg)}
//                                   {renderReactions(msg)}
//                                   <div className="flex items-center justify-end space-x-1 mt-1">
//                                     <p className="text-xs opacity-75">
//                                       {new Date(
//                                         msg.timestamp,
//                                       ).toLocaleTimeString()}
//                                     </p>
//                                     {msg.sender?.userId ===
//                                       (user._id || user.id) && (
//                                       <span className="message-status">
//                                         {msg.read ? (
//                                           <CheckCheck
//                                             size={12}
//                                             className="read-receipt"
//                                           />
//                                         ) : (
//                                           <Check
//                                             size={12}
//                                             className="delivered"
//                                           />
//                                         )}
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           <div ref={messagesEndRef} />
//                         </div>

//                         <form onSubmit={sendMessage} className="flex space-x-2">
//                           <input
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={handleFileUpload}
//                             className="hidden"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => fileInputRef.current?.click()}
//                             className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
//                             disabled={isUploading || serverStatus === "offline"}
//                           >
//                             <Paperclip size={18} />
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                             className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors relative"
//                             disabled={serverStatus === "offline"}
//                           >
//                             <Smile size={18} />
//                             {showEmojiPicker && (
//                               <div className="emoji-picker">
//                                 {emojis.map((emoji, index) => (
//                                   <span
//                                     key={index}
//                                     className="emoji-item"
//                                     onClick={() => addEmoji(emoji)}
//                                   >
//                                     {emoji}
//                                   </span>
//                                 ))}
//                               </div>
//                             )}
//                           </button>
//                           <input
//                             type="text"
//                             value={newMessage}
//                             onChange={(e) => {
//                               setNewMessage(e.target.value);
//                             }}
//                             placeholder={`Message ${selectedStaff.username}...`}
//                             className="flex-1 bg-gray-600 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
//                             disabled={serverStatus === "offline"}
//                           />
//                           <button
//                             type="submit"
//                             disabled={
//                               !newMessage.trim() ||
//                               isUploading ||
//                               serverStatus === "offline"
//                             }
//                             className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                           >
//                             <Send size={18} />
//                           </button>
//                         </form>
//                         {isUploading && (
//                           <div className="mt-2 relative h-1 bg-gray-600 rounded overflow-hidden">
//                             <div
//                               className="upload-progress"
//                               style={{
//                                 width: `${Object.values(uploadProgress)[0] || 0}%`,
//                               }}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     )}
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className={`grid ${getGridLayout()} gap-4 h-full`}>
//                   <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video video-container">
//                     <video
//                       ref={(el) => {
//                         if (el && !localVideoRef.current) {
//                           localVideoRef.current = el;
//                           if (WebRTCService.localStream && !el.srcObject) {
//                             el.srcObject = WebRTCService.localStream;
//                             el.play()
//                               .then(() => {
//                                 setLocalVideoReady(true);
//                               })
//                               .catch(() => {});
//                           }
//                         }
//                       }}
//                       autoPlay
//                       playsInline
//                       muted
//                       className="w-full h-full object-cover"
//                       style={{
//                         transform: "translateZ(0)",
//                         backfaceVisibility: "hidden",
//                       }}
//                     />

//                     <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between video-overlay">
//                       <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm flex items-center space-x-2">
//                         <span>You ({user.username})</span>
//                         {audioLevel > 0.1 && (
//                           <div className="w-16 h-1 bg-gray-600 rounded overflow-hidden">
//                             <div
//                               className="h-full bg-green-500 transition-all"
//                               style={{
//                                 width: `${Math.min(audioLevel * 100, 100)}%`,
//                               }}
//                             />
//                           </div>
//                         )}
//                       </div>

//                       {!isVideoEnabled && (
//                         <div className="bg-red-600 text-white px-2 py-1 rounded text-xs">
//                           Video Off
//                         </div>
//                       )}
//                     </div>

//                     {!localVideoReady &&
//                       isVideoEnabled &&
//                       callType === "video" && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
//                           <div className="text-center text-gray-400">
//                             <VideoOff size={32} className="mx-auto mb-2" />
//                             <p className="text-sm">Camera initializing...</p>
//                           </div>
//                         </div>
//                       )}

//                     {callType === "audio" && (
//                       <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
//                         <div className="text-center text-white">
//                           <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
//                             <PhoneCall size={48} />
//                           </div>
//                           <p className="text-lg font-semibold">Audio Call</p>
//                           <p className="text-sm text-gray-400">
//                             Camera is disabled for audio-only mode
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     <div
//                       className={`connection-indicator connection-${connectionQuality}`}
//                     />
//                   </div>

//                   {Object.entries(remoteStreams).map(([userId, stream]) => {
//                     const participant = participants.find(
//                       (p) => p.userId === userId,
//                     );
//                     return (
//                       <div
//                         key={userId}
//                         className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video video-container"
//                       >
//                         <video
//                           ref={(el) => {
//                             if (el) {
//                               if (!remoteVideosRef.current[userId]) {
//                                 remoteVideosRef.current[userId] = el;
//                               }

//                               if (
//                                 stream &&
//                                 stream.active &&
//                                 (!el.srcObject || el.srcObject.id !== stream.id)
//                               ) {
//                                 el.srcObject = stream;

//                                 setTimeout(() => {
//                                   if (el.paused) {
//                                     el.play()
//                                       .then(() => {
//                                         const playBtn = document.getElementById(
//                                           `play-btn-${userId}`,
//                                         );
//                                         if (playBtn)
//                                           playBtn.style.opacity = "0";
//                                       })
//                                       .catch(() => {
//                                         const playBtn = document.getElementById(
//                                           `play-btn-${userId}`,
//                                         );
//                                         if (playBtn)
//                                           playBtn.style.opacity = "1";
//                                       });
//                                   }
//                                 }, 100);
//                               }
//                             }
//                           }}
//                           autoPlay
//                           playsInline
//                           className="w-full h-full object-cover"
//                           style={{
//                             transform: "scaleX(-1) translateZ(0)",
//                             backfaceVisibility: "hidden",
//                             WebkitBackfaceVisibility: "hidden",
//                             backgroundColor: "#2d2d2d",
//                             minHeight: "200px",
//                             willChange: "transform",
//                           }}
//                         />
//                         <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm z-10 video-overlay">
//                           {participant?.username || "Remote User"} (
//                           {participant?.role || "staff"})
//                         </div>
//                         <button
//                           id={`play-btn-${userId}`}
//                           onClick={() => {
//                             const videoEl = remoteVideosRef.current[userId];
//                             if (videoEl) {
//                               videoEl.play();
//                               document.getElementById(
//                                 `play-btn-${userId}`,
//                               ).style.opacity = "0";
//                             }
//                           }}
//                           className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity play-button-overlay"
//                           style={{ opacity: 0 }}
//                         >
//                           <div className="bg-blue-600 rounded-full p-4 text-white shadow-lg">
//                             <Play size={24} />
//                           </div>
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2 shadow-lg">
//                   <button
//                     onClick={toggleAudio}
//                     className={`p-3 rounded-full transition-colors ${
//                       isAudioEnabled
//                         ? "bg-gray-700 hover:bg-gray-600"
//                         : "bg-red-600 hover:bg-red-700"
//                     }`}
//                     title={`${isAudioEnabled ? "Mute" : "Unmute"} (Ctrl+M)`}
//                   >
//                     {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
//                   </button>

//                   {callType === "video" && (
//                     <button
//                       onClick={toggleVideo}
//                       className={`p-3 rounded-full transition-colors ${
//                         isVideoEnabled
//                           ? "bg-gray-700 hover:bg-gray-600"
//                           : "bg-red-600 hover:bg-red-700"
//                       }`}
//                       title={`${isVideoEnabled ? "Stop" : "Start"} Video (Ctrl+V)`}
//                     >
//                       {isVideoEnabled ? (
//                         <Video size={20} />
//                       ) : (
//                         <VideoOff size={20} />
//                       )}
//                     </button>
//                   )}

//                   {callType === "video" && (
//                     <button
//                       onClick={setAudioOnlyMode}
//                       className={`p-3 rounded-full transition-colors ${
//                         !isVideoEnabled && isAudioEnabled
//                           ? "bg-purple-600 hover:bg-purple-700 ring-2 ring-purple-400"
//                           : "bg-purple-600 hover:bg-purple-700"
//                       }`}
//                       title="Audio Only Mode (Ctrl+A)"
//                     >
//                       <Volume2 size={20} />
//                     </button>
//                   )}

//                   {callType === "video" && (
//                     <button
//                       onClick={toggleScreenShare}
//                       className={`p-3 rounded-full transition-colors ${
//                         isScreenSharing
//                           ? "bg-blue-600 hover:bg-blue-700"
//                           : "bg-gray-700 hover:bg-gray-600"
//                       }`}
//                       title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
//                     >
//                       {isScreenSharing ? (
//                         <MonitorDown size={20} />
//                       ) : (
//                         <MonitorUp size={20} />
//                       )}
//                     </button>
//                   )}

//                   <button
//                     onClick={leaveCall}
//                     className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
//                     title="End Call"
//                   >
//                     <PhoneOff size={20} />
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>

//           {showChat && (
//             <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
//               <div className="p-4 border-b border-gray-700 flex justify-between items-center">
//                 <h3 className="text-white font-semibold">
//                   {WebRTCService.currentRoom
//                     ? "Room Chat"
//                     : selectedStaff
//                       ? `Chat with ${selectedStaff.username}`
//                       : "Chat"}
//                 </h3>
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => setShowSearch(!showSearch)}
//                     className={`p-1 rounded-lg transition-colors ${showSearch ? "bg-blue-600" : "hover:bg-gray-700"}`}
//                     title="Search"
//                   >
//                     <Search size={16} />
//                   </button>
//                   <button
//                     onClick={() =>
//                       setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
//                     }
//                     className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
//                     title={
//                       sortOrder === "desc" ? "Newest first" : "Oldest first"
//                     }
//                   >
//                     {sortOrder === "desc" ? (
//                       <SortDesc size={16} />
//                     ) : (
//                       <SortAsc size={16} />
//                     )}
//                   </button>
//                   <button
//                     onClick={() =>
//                       setFilterType((prev) => {
//                         if (prev === "all") return "text";
//                         if (prev === "text") return "media";
//                         if (prev === "media") return "system";
//                         return "all";
//                       })
//                     }
//                     className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
//                     title={`Filter: ${filterType}`}
//                   >
//                     <Filter size={16} />
//                   </button>
//                   <button
//                     onClick={() => setIsSelectionMode(!isSelectionMode)}
//                     className={`p-1 rounded-lg transition-colors ${isSelectionMode ? "bg-blue-600" : "hover:bg-gray-700"}`}
//                     title="Select messages"
//                   >
//                     <Check size={16} />
//                   </button>
//                   <button
//                     onClick={() => {
//                       setMessageToDelete("all");
//                       setShowDeleteConfirm(true);
//                     }}
//                     className="p-1 hover:bg-gray-700 rounded-lg transition-colors text-red-400"
//                     title="Clear chat"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                   <button
//                     onClick={exportChat}
//                     className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
//                     title="Export chat"
//                   >
//                     <Download size={16} />
//                   </button>
//                   <button
//                     onClick={() => setShowChat(false)}
//                     className="text-gray-400 hover:text-white transition-colors"
//                   >
//                     <X size={18} />
//                   </button>
//                 </div>
//               </div>

//               {showSearch && (
//                 <div className="p-2 border-b border-gray-700">
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search messages..."
//                     className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
//                   />
//                 </div>
//               )}

//               <div
//                 ref={chatContainerRef}
//                 className="flex-1 overflow-y-auto p-4 space-y-3"
//               >
//                 {Array.isArray(filteredMessages) &&
//                 filteredMessages.length > 0 ? (
//                   filteredMessages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex flex-col ${
//                         msg.system
//                           ? "items-center"
//                           : msg.sender?.userId === (user._id || user.id)
//                             ? "items-end"
//                             : "items-start"
//                       }`}
//                       onMouseEnter={() =>
//                         !isSelectionMode && setShowMessageOptions(msg.id)
//                       }
//                       onMouseLeave={() =>
//                         !isSelectionMode && setShowMessageOptions(null)
//                       }
//                     >
//                       {!msg.system && msg.sender && (
//                         <div className="flex items-center space-x-2 mb-1">
//                           <div
//                             className={`message-avatar ${msg.sender?.userId === (user._id || user.id) ? "bg-blue-600" : "bg-green-600"}`}
//                           >
//                             {msg.sender.username?.[0]?.toUpperCase() || "?"}
//                           </div>
//                           <span className="text-xs font-semibold text-gray-300">
//                             {msg.sender.username}
//                           </span>
//                           {msg.private && (
//                             <span className="text-[10px] bg-purple-800 px-1 rounded text-white">
//                               Private
//                             </span>
//                           )}
//                         </div>
//                       )}

//                       <div
//                         className={`max-w-[90%] px-3 py-2 rounded-lg chat-message relative ${
//                           msg.system
//                             ? "bg-gray-700 text-gray-300 text-sm"
//                             : msg.private
//                               ? "bg-purple-600 text-white"
//                               : msg.sender?.userId === (user._id || user.id)
//                                 ? "bg-blue-600 text-white"
//                                 : "bg-gray-700 text-white"
//                         }`}
//                         onClick={() =>
//                           isSelectionMode && toggleMessageSelection(msg.id)
//                         }
//                         style={{
//                           cursor: isSelectionMode ? "pointer" : "default",
//                           border: selectedMessages.has(msg.id)
//                             ? "2px solid #3b82f6"
//                             : "none",
//                         }}
//                       >
//                         {showMessageOptions === msg.id && !isSelectionMode && (
//                           <div className="message-options">
//                             <button
//                               onClick={() => setReplyingTo(msg)}
//                               className="text-white hover:text-blue-300"
//                               title="Reply"
//                             >
//                               <MessageCircle size={14} />
//                             </button>
//                             <button
//                               onClick={() => setShowReactions(msg.id)}
//                               className="text-white hover:text-yellow-300"
//                               title="React"
//                             >
//                               <Smile size={14} />
//                             </button>
//                             <button
//                               onClick={() => copyMessage(msg.text)}
//                               className="text-white hover:text-green-300"
//                               title="Copy"
//                             >
//                               <Copy size={14} />
//                             </button>
//                             {msg.sender?.userId === (user._id || user.id) && (
//                               <>
//                                 <button
//                                   onClick={() => setEditingMessage(msg)}
//                                   className="text-white hover:text-blue-300"
//                                   title="Edit"
//                                 >
//                                   <svg
//                                     width="14"
//                                     height="14"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                   >
//                                     <path d="M17 3l4 4-7 7H10v-4l7-7z M3 21l4-4" />
//                                   </svg>
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     setMessageToDelete(msg.id);
//                                     setShowDeleteConfirm(true);
//                                   }}
//                                   className="text-white hover:text-red-300"
//                                   title="Delete"
//                                 >
//                                   <Trash2 size={14} />
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         )}

//                         {showReactions === msg.id && (
//                           <div className="absolute bottom-full left-0 mb-1 bg-gray-700 rounded-lg p-1 flex space-x-1 z-50">
//                             <button
//                               onClick={() => addReaction(msg.id, "👍")}
//                               className="hover:bg-gray-600 p-1 rounded"
//                             >
//                               👍
//                             </button>
//                             <button
//                               onClick={() => addReaction(msg.id, "❤️")}
//                               className="hover:bg-gray-600 p-1 rounded"
//                             >
//                               ❤️
//                             </button>
//                             <button
//                               onClick={() => addReaction(msg.id, "😂")}
//                               className="hover:bg-gray-600 p-1 rounded"
//                             >
//                               😂
//                             </button>
//                             <button
//                               onClick={() => addReaction(msg.id, "😮")}
//                               className="hover:bg-gray-600 p-1 rounded"
//                             >
//                               😮
//                             </button>
//                             <button
//                               onClick={() => addReaction(msg.id, "😢")}
//                               className="hover:bg-gray-600 p-1 rounded"
//                             >
//                               😢
//                             </button>
//                             <button
//                               onClick={() => addReaction(msg.id, "👎")}
//                               className="hover:bg-gray-600 p-1 rounded"
//                             >
//                               👎
//                             </button>
//                           </div>
//                         )}

//                         {replyingTo && replyingTo.id === msg.id && (
//                           <div className="text-xs bg-gray-600 p-1 rounded mb-1">
//                             Replying to {replyingTo.sender?.username}
//                           </div>
//                         )}

//                         {renderMessageContent(msg)}
//                         {renderReactions(msg)}

//                         <div className="flex items-center justify-end space-x-1 mt-1">
//                           <span className="message-timestamp">
//                             {msg.timestamp
//                               ? new Date(msg.timestamp).toLocaleTimeString()
//                               : ""}
//                           </span>
//                           {msg.sender?.userId === (user._id || user.id) &&
//                             !msg.system && (
//                               <span className="message-status">
//                                 {msg.read ? (
//                                   <CheckCheck
//                                     size={10}
//                                     className="read-receipt"
//                                   />
//                                 ) : (
//                                   <Check size={10} className="delivered" />
//                                 )}
//                               </span>
//                             )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-8">
//                     <MessageCircle size={48} className="mb-3 opacity-50" />
//                     <p className="text-sm">No messages yet</p>
//                     <p className="text-xs mt-1">Start the conversation</p>
//                   </div>
//                 )}

//                 {Object.values(typingUsers).filter(Boolean).length > 0 && (
//                   <div className="flex items-start">
//                     <div className="typing-indicator">
//                       {Object.values(typingUsers)
//                         .filter(Boolean)
//                         .map((name, i) => (
//                           <span key={i} className="text-xs text-gray-400 mr-1">
//                             {name}
//                           </span>
//                         ))}
//                       <span className="text-xs text-gray-400">is typing</span>
//                       <div className="flex space-x-1 ml-2">
//                         <div className="typing-dot"></div>
//                         <div className="typing-dot"></div>
//                         <div className="typing-dot"></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div ref={messagesEndRef} />
//               </div>

//               <form
//                 onSubmit={sendMessage}
//                 className="p-4 border-t border-gray-700"
//               >
//                 {replyingTo && (
//                   <div className="mb-2 p-2 bg-gray-700 rounded-lg flex justify-between items-center">
//                     <span className="text-xs text-gray-300">
//                       Replying to {replyingTo.sender?.username}:{" "}
//                       {replyingTo.text?.substring(0, 30)}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => setReplyingTo(null)}
//                       className="text-gray-400 hover:text-white"
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                 )}
//                 <div className="flex space-x-2">
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileUpload}
//                     className="hidden"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
//                     disabled={isUploading || serverStatus === "offline"}
//                   >
//                     <Paperclip size={18} />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                     className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors relative"
//                     disabled={serverStatus === "offline"}
//                   >
//                     <Smile size={18} />
//                     {showEmojiPicker && (
//                       <div className="emoji-picker">
//                         {emojis.map((emoji, index) => (
//                           <span
//                             key={index}
//                             className="emoji-item"
//                             onClick={() => addEmoji(emoji)}
//                           >
//                             {emoji}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </button>
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => {
//                       setNewMessage(e.target.value);
//                       if (WebRTCService.currentRoom) {
//                         handleTyping(e.target.value.length > 0);
//                       }
//                     }}
//                     placeholder={
//                       WebRTCService.currentRoom
//                         ? "Type a message..."
//                         : selectedStaff
//                           ? `Message ${selectedStaff.username}...`
//                           : "Select a staff to chat..."
//                     }
//                     className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
//                     disabled={
//                       (!WebRTCService.currentRoom && !selectedStaff) ||
//                       isUploading ||
//                       serverStatus === "offline"
//                     }
//                   />
//                   <button
//                     type="submit"
//                     disabled={
//                       !newMessage.trim() ||
//                       (!WebRTCService.currentRoom && !selectedStaff) ||
//                       isUploading ||
//                       serverStatus === "offline"
//                     }
//                     className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <Send size={18} />
//                   </button>
//                 </div>
//                 {isUploading && (
//                   <div className="mt-2 relative h-1 bg-gray-600 rounded overflow-hidden">
//                     <div
//                       className="upload-progress"
//                       style={{
//                         width: `${Object.values(uploadProgress)[0] || 0}%`,
//                       }}
//                     />
//                   </div>
//                 )}
//               </form>
//             </div>
//           )}

//           {showParticipants && (
//             <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-white font-semibold">
//                   Participants ({participants.length + 1})
//                 </h3>
//                 <button
//                   onClick={() => setShowParticipants(false)}
//                   className="text-gray-400 hover:text-white transition-colors"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg">
//                   <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                     {user.username[0].toUpperCase()}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-white text-sm font-medium">
//                       {user.username}
//                     </p>
//                     <p className="text-xs text-gray-400">{user.role} (You)</p>
//                   </div>
//                   <div className="flex space-x-1">
//                     {isAudioEnabled ? (
//                       <Mic size={14} className="text-green-500" />
//                     ) : (
//                       <MicOff size={14} className="text-red-500" />
//                     )}
//                     {isVideoEnabled && callType === "video" ? (
//                       <Video size={14} className="text-green-500" />
//                     ) : (
//                       <VideoOff size={14} className="text-red-500" />
//                     )}
//                   </div>
//                 </div>

//                 {participants.map((participant) => (
//                   <div
//                     key={participant.userId}
//                     className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg"
//                   >
//                     <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
//                       {participant.username[0].toUpperCase()}
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-white text-sm font-medium">
//                         {participant.username}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         {participant.role}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default VideoConsultation;






//working


/* eslint-disable no-unused-vars */

import { useEffect, useRef, useState, useMemo } from "react";
import WebRTCService from "../utils/webrtc.js";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  MessageCircle,
  X,
  Send,
  Users,
  MonitorUp,
  MonitorDown,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  PhoneCall,
  Video as VideoIcon,
  User,
  Paperclip,
  Smile,
  Trash2,
  File,
  Download,
  CheckCheck,
  Play,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";

const VideoConsultation = () => {
  const [status, setStatus] = useState("Disconnected");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [localVideoReady, setLocalVideoReady] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState("good");
  const [callType, setCallType] = useState(null);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffList, setShowStaffList] = useState(true);
  const [incomingCall, setIncomingCall] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatMode, setChatMode] = useState("room");
  const [showMessageOptions, setShowMessageOptions] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(null);
  const [isPlaying, setIsPlaying] = useState({});
  const [volume, setVolume] = useState({});
  const [isMuted, setIsMuted] = useState({});
  const [playbackRate, setPlaybackRate] = useState({});
  const [showReactions, setShowReactions] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");
  const [showReconnect, setShowReconnect] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [transport, setTransport] = useState("unknown");
  const [remoteVideoReady, setRemoteVideoReady] = useState({});

  const localVideoRef = useRef();
  const remoteVideosRef = useRef({});
  const messagesEndRef = useRef();
  const chatContainerRef = useRef();
  const mainContainerRef = useRef();
  const attachedStreamsRef = useRef(new Set());
  const connectionTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef();
  const healthCheckIntervalRef = useRef(null);

  // Emoji list
  const emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸",
    "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️",
    "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡",
    "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓",
    "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄",
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
  ];

  const styles = `
    .video-container {
      background-color: #2d2d2d;
      position: relative;
      overflow: hidden;
      contain: strict;
      border-radius: 0.5rem;
    }
    
    .video-container video {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: #1a1a1a;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transform: translateZ(0);
      -webkit-transform: translateZ(0);
      will-change: transform;
      pointer-events: auto;
    }
    
    .video-overlay {
      position: absolute;
      bottom: 8px;
      left: 8px;
      right: 8px;
      z-index: 10;
      pointer-events: none;
    }
    
    .play-button-overlay {
      position: absolute;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: auto;
    }
    
    .play-button-overlay:hover {
      opacity: 1;
    }
    
    .connection-indicator {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      z-index: 30;
    }
    
    .connection-good {
      background-color: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
    
    .connection-poor {
      background-color: #f59e0b;
      box-shadow: 0 0 8px #f59e0b;
    }
    
    .connection-bad {
      background-color: #ef4444;
      box-shadow: 0 0 8px #ef4444;
    }

    .server-status {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background: #1f2937;
      border-radius: 9999px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .server-status.online {
      border-left: 4px solid #10b981;
    }

    .server-status.offline {
      border-left: 4px solid #ef4444;
    }

    .server-status.checking {
      border-left: 4px solid #f59e0b;
    }

    .reconnecting-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(245, 158, 11, 0.9);
      color: white;
      text-align: center;
      padding: 8px;
      z-index: 9999;
      animation: slideDown 0.3s ease;
      backdrop-filter: blur(4px);
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
      }
      to {
        transform: translateY(0);
      }
    }

    .call-button {
      transition: all 0.2s ease;
    }
    
    .call-button:hover {
      transform: scale(1.05);
    }
    
    .call-button:active {
      transform: scale(0.95);
    }

    .incoming-call-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        transform: translate(-50%, -60%);
        opacity: 0;
      }
      to {
        transform: translate(-50%, -50%);
        opacity: 1;
      }
    }

    .chat-message {
      transition: all 0.2s ease;
      position: relative;
    }
    
    .chat-message:hover {
      transform: translateX(2px);
    }
    
    .chat-message:hover .message-options {
      opacity: 1;
    }

    .message-options {
      position: absolute;
      top: -20px;
      right: 0;
      opacity: 0;
      transition: opacity 0.2s;
      display: flex;
      gap: 4px;
      background: #374151;
      border-radius: 9999px;
      padding: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 50;
    }

    .message-reactions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 4px;
    }

    .reaction-badge {
      background: #4b5563;
      border-radius: 9999px;
      padding: 2px 6px;
      font-size: 11px;
      display: inline-flex;
      align-items: center;
      gap: 2px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .reaction-badge:hover {
      background: #6b7280;
      transform: scale(1.05);
    }

    .reaction-badge.active {
      background: #3b82f6;
    }

    .emoji-picker {
      position: absolute;
      bottom: 100%;
      left: 0;
      background: #1f2937;
      border-radius: 0.5rem;
      padding: 8px;
      box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
      z-index: 100;
      max-height: 300px;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 4px;
    }

    .emoji-item {
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      font-size: 20px;
      transition: all 0.2s;
    }

    .emoji-item:hover {
      background: #374151;
      transform: scale(1.1);
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      width: fit-content;
    }

    .typing-dot {
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
      animation: typingBounce 1.4s infinite ease-in-out;
    }

    .typing-dot:nth-child(1) { animation-delay: 0s; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-8px); }
    }

    .unread-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ef4444;
      color: white;
      border-radius: 9999px;
      min-width: 18px;
      height: 18px;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }

    .reconnect-button {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .transport-badge {
      font-size: 10px;
      background: #374151;
      padding: 2px 6px;
      border-radius: 12px;
      margin-left: 8px;
    }

    .debug-info {
      position: absolute;
      top: 30px;
      right: 8px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 10px;
      z-index: 40;
    }
  `;

  // Health check function
  const checkServerHealth = async () => {
    try {
      setServerStatus("checking");
      const isHealthy = await WebRTCService.checkServerHealth();
      setServerStatus(isHealthy ? "online" : "offline");

      if (!isHealthy && !WebRTCService.isConnected()) {
        setShowReconnect(true);
        setError("Server is not responding. Please check your connection.");
      } else {
        setShowReconnect(false);
        if (isHealthy && !WebRTCService.isConnected() && user) {
          attemptReconnect();
        }
      }
    } catch (error) {
      console.error("Health check error:", error);
      setServerStatus("offline");
      setShowReconnect(true);
    }
  };

  // Reconnection function
  const attemptReconnect = () => {
    if (!user || reconnecting) return;

    setReconnecting(true);
    setError("Attempting to reconnect...");
    setConnectionAttempts((prev) => prev + 1);

    // Disconnect existing socket
    WebRTCService.disconnect();

    // Reinitialize
    const userId = user._id || user.id || user.userId;
    const username = user.username || user.name || user.email || "User";

    setTimeout(() => {
      WebRTCService.initialize(userId, username, user.role);
      setReconnecting(false);
      setError(null);
    }, 2000);
  };

  // Get user from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        const normalizedUser = {
          ...parsedUser,
          username: parsedUser.username || parsedUser.name || parsedUser.email || "User",
          userId: parsedUser._id || parsedUser.id || parsedUser.userId,
          role: parsedUser.role || "patient",
        };
        setUser(normalizedUser);
        console.log("User loaded:", normalizedUser);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  // Monitor remote streams and ensure they're attached
  useEffect(() => {
    console.log('📡 Remote streams updated:', Object.keys(remoteStreams).length);
    
    // Force attachment of any streams that aren't attached
    Object.entries(remoteStreams).forEach(([userId, stream]) => {
      const videoEl = remoteVideosRef.current[userId];
      
      if (videoEl && stream && stream.active) {
        if (!videoEl.srcObject || videoEl.srcObject.id !== stream.id) {
          console.log(`🎥 Force attaching stream for ${userId}`);
          videoEl.srcObject = stream;
          videoEl.muted = false;
          
          // Log stream details
          console.log(`Stream ${userId}:`, {
            videoTracks: stream.getVideoTracks().length,
            videoEnabled: stream.getVideoTracks()[0]?.enabled,
            videoReadyState: stream.getVideoTracks()[0]?.readyState,
            audioTracks: stream.getAudioTracks().length
          });
          
          videoEl.play().catch(e => {
            console.log(`⚠️ Could not autoplay ${userId}:`, e);
            setRemoteVideoReady(prev => ({ ...prev, [userId]: false }));
          });
        }
      }
    });
  }, [remoteStreams]);

  // Initialize WebRTC and set up callbacks
  useEffect(() => {
    if (!user) return;

    const userId = user._id || user.id || user.userId;
    if (!userId) {
      setError("Invalid user data. Please log in again.");
      return;
    }

    const username = user.username || user.name || user.email || "User";

    console.log("Initializing WebRTC with:", {
      userId,
      username,
      role: user.role,
    });

    // Initialize WebRTC service
    WebRTCService.initialize(userId, username, user.role);
    setIsInitialized(true);

    // Start health checks
    checkServerHealth();
    healthCheckIntervalRef.current = setInterval(checkServerHealth, 30000);

    // Check for pending call
    if (WebRTCService.hasPendingCall && WebRTCService.hasPendingCall()) {
      const pendingCall = WebRTCService.getPendingCall();
      if (pendingCall) {
        setIncomingCall(pendingCall);
      }
    }

    // Set up callbacks
    WebRTCService.onIncomingCall = (callData) => {
      console.log("📞 Incoming call received:", callData);
      setIncomingCall(callData);
    };

    WebRTCService.onConnectionStateChange = ({ state, data }) => {
      setStatus(`${state} ${data ? `- ${data}` : ""}`);

      if (state === "connected") {
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
        setShowReconnect(false);
        // Get transport type
        if (WebRTCService.socket && WebRTCService.socket.io) {
          setTransport(WebRTCService.socket.io.engine.transport.name);
        }
      } else if (state === "error") {
        setError(data);
        setIsConnecting(false);
        setShowReconnect(true);
      } else if (state === "disconnected") {
        setShowReconnect(true);
      } else if (state === "room_joined") {
        if (WebRTCService.socket) {
          WebRTCService.socket.emit("request-chat-history", data);
        }
      }
    };

    WebRTCService.onUserJoined = (userData) => {
      setParticipants((prev) => [...prev, userData]);
      addSystemMessage(`👋 ${userData.username} joined the consultation`);
    };

    WebRTCService.onUserLeft = (userData) => {
      setParticipants((prev) =>
        prev.filter((p) => p.userId !== userData.userId),
      );
      setRemoteStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[userData.userId];
        return newStreams;
      });
      attachedStreamsRef.current.delete(userData.userId);
      addSystemMessage(`👋 ${userData.username} left the consultation`);
    };

    WebRTCService.onRemoteStream = (userId, stream) => {
      console.log(`📡 Remote stream received for ${userId}:`, {
        id: stream.id,
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length,
        active: stream.active
      });
      
      setRemoteStreams((prev) => {
        // Only update if it's a new stream
        if (prev[userId] && prev[userId].id === stream.id) {
          return prev;
        }
        console.log(`✅ Adding remote stream for ${userId}`);
        return { ...prev, [userId]: stream };
      });
    };

    WebRTCService.onMessageReceived = (message) => {
      setMessages((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        return [...current, message];
      });
      scrollToBottom();

      if (!showChat) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    WebRTCService.onDirectMessageReceived = (message) => {
      setMessages((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        return [...current, { ...message, private: true }];
      });
      scrollToBottom();

      if (!showChat) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    WebRTCService.onAudioLevelChange = (level) => {
      setAudioLevel(level);
    };

    WebRTCService.onCallRejected = (from, callType) => {
      setIsConnecting(false);
      setShowStaffList(true);
      setSelectedStaff(null);
      addSystemMessage(`❌ Call rejected by ${from.username}`);
    };

    WebRTCService.onStaffListUpdate = (staffList) => {
      console.log("Staff list updated:", staffList);
      setAvailableStaff(Array.isArray(staffList) ? staffList : []);
    };

    const socket = WebRTCService.socket;
    if (socket) {
      socket.on("user-typing", ({ userId, username, isTyping }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [userId]: isTyping ? username : null,
        }));

        if (isTyping) {
          setTimeout(() => {
            setTypingUsers((prev) => ({
              ...prev,
              [userId]: null,
            }));
          }, 3000);
        }
      });

      socket.on("chat-history", (history) => {
        const historyArray = Array.isArray(history) ? history : [];
        setChatHistory(historyArray);
        setMessages(historyArray);
      });

      socket.on("message-reaction", ({ messageId, reaction, userId }) => {
        setMessages((prev) => {
          const current = Array.isArray(prev) ? prev : [];
          return current.map((msg) => {
            if (msg?.id === messageId) {
              const reactions = msg.reactions || {};
              if (!reactions[reaction]) reactions[reaction] = [];

              if (reactions[reaction].includes(userId)) {
                reactions[reaction] = reactions[reaction].filter(
                  (id) => id !== userId,
                );
              } else {
                reactions[reaction] = [...reactions[reaction], userId];
              }

              return { ...msg, reactions };
            }
            return msg;
          });
        });
      });

      socket.on("message-deleted", ({ messageId }) => {
        setMessages((prev) => {
          const current = Array.isArray(prev) ? prev : [];
          return current.filter((msg) => msg?.id !== messageId);
        });
      });

      socket.on("chat-cleared", ({ roomId }) => {
        setMessages([]);
        addSystemMessage("🧹 Chat history cleared");
      });
    }

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
      leaveCall();
      WebRTCService.disconnect();
      attachedStreamsRef.current.clear();
    };
  }, [user]);

  // Socket event listeners for connection monitoring
  useEffect(() => {
    if (!WebRTCService.socket) return;

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);
      setError(`Connection error: ${error.message}. Retrying...`);
      setShowReconnect(true);

      // Force transport to polling if websocket fails
      if (WebRTCService.socket && WebRTCService.socket.io) {
        WebRTCService.socket.io.opts.transports = ["polling"];
      }
    };

    const handleReconnectAttempt = (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
      setStatus(`Reconnecting... (attempt ${attempt})`);
      setConnectionAttempts(attempt);
    };

    const handleReconnect = () => {
      console.log("Reconnected successfully");
      setStatus("Connected");
      setError(null);
      setShowReconnect(false);
      if (WebRTCService.socket && WebRTCService.socket.io) {
        setTransport(WebRTCService.socket.io.engine.transport.name);
      }
    };

    const handleTransport = (transport) => {
      console.log("Transport changed to:", transport);
      setTransport(transport);
    };

    WebRTCService.socket.on("connect_error", handleConnectError);
    WebRTCService.socket.on("reconnect_attempt", handleReconnectAttempt);
    WebRTCService.socket.on("reconnect", handleReconnect);

    if (WebRTCService.socket.io) {
      WebRTCService.socket.io.engine.on("transport", handleTransport);
    }

    return () => {
      if (WebRTCService.socket) {
        WebRTCService.socket.off("connect_error", handleConnectError);
        WebRTCService.socket.off("reconnect_attempt", handleReconnectAttempt);
        WebRTCService.socket.off("reconnect", handleReconnect);
        if (WebRTCService.socket.io) {
          WebRTCService.socket.io.engine.off("transport", handleTransport);
        }
      }
    };
  }, [WebRTCService.socket]);

  // Attach local stream to video element
  useEffect(() => {
    const checkAndAttachStream = () => {
      if (!localVideoRef.current) {
        return false;
      }

      const stream = WebRTCService.localStream;
      if (!stream) {
        return false;
      }

      if (
        !localVideoRef.current.srcObject ||
        localVideoRef.current.srcObject.id !== stream.id
      ) {
        localVideoRef.current.srcObject = stream;

        localVideoRef.current
          .play()
          .then(() => {
            setLocalVideoReady(true);
          })
          .catch(() => {
            setLocalVideoReady(true);
          });
      } else {
        setLocalVideoReady(true);
      }

      return true;
    };

    if (!checkAndAttachStream()) {
      const interval = setInterval(() => {
        if (checkAndAttachStream()) {
          clearInterval(interval);
        }
      }, 500);

      setTimeout(() => clearInterval(interval), 10000);

      return () => clearInterval(interval);
    }
  }, [WebRTCService.localStream]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset unread count when chat is opened
  useEffect(() => {
    if (showChat) {
      setUnreadCount(0);
    }
  }, [showChat]);

  // Filter and sort messages
  const filteredMessages = useMemo(() => {
    const messagesArray = Array.isArray(messages) ? messages : [];

    return messagesArray
      .filter((msg) => {
        if (!msg) return false;
        if (filterType === "text") return msg.type === "text" && !msg.system;
        if (filterType === "media") return msg.type !== "text" && !msg.system;
        if (filterType === "system") return msg.system;
        return true;
      })
      .filter((msg) => {
        if (!searchQuery) return true;
        return (
          msg.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.sender?.username
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
      });
  }, [messages, filterType, searchQuery, sortOrder]);

  const addSystemMessage = (text) => {
    const message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      system: true,
      type: "system",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return [...current, message];
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startCall = async (staff, type) => {
    if (!staff) {
      setError("Please select a staff member");
      return;
    }

    if (serverStatus === "offline") {
      setError("Server is offline. Please check your connection.");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      setCallType(type);
      setSelectedStaff(staff);
      setShowStaffList(false);
      setMessages([]);
      setRemoteStreams({}); // Clear previous remote streams

      setStatus(`Calling ${staff.username}...`);

      await WebRTCService.startCall(staff.userId, type);

      setStatus(`In call with ${staff.username}`);
      addSystemMessage(
        `${type === "audio" ? "🎧" : "📹"} Started ${type} call with ${staff.username}`,
      );
    } catch (error) {
      console.error("Failed to start call:", error);
      setError(error.message);
      setIsConnecting(false);
      setShowStaffList(true);
      setSelectedStaff(null);
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;

    if (serverStatus === "offline") {
      setError("Server is offline. Please check your connection.");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      setCallType(incomingCall.callType);
      setSelectedStaff(incomingCall.from);
      setShowStaffList(false);
      setMessages([]);
      setRemoteStreams({}); // Clear previous remote streams

      setStatus(`Accepting call from ${incomingCall.from.username}...`);

      await WebRTCService.acceptCall(
        incomingCall.roomId,
        incomingCall.callType,
      );

      setStatus(`In call with ${incomingCall.from.username}`);
      setIncomingCall(null);
      addSystemMessage(
        `${incomingCall.callType === "audio" ? "🎧" : "📹"} Accepted ${incomingCall.callType} call from ${incomingCall.from.username}`,
      );
    } catch (error) {
      console.error("Failed to accept call:", error);
      setError(error.message);
      setIsConnecting(false);
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      WebRTCService.rejectCall(incomingCall.from.userId, incomingCall.callType);
      setIncomingCall(null);
      addSystemMessage(`❌ Rejected call from ${incomingCall.from.username}`);
    }
  };

  const leaveCall = () => {
    WebRTCService.leaveRoom();
    setStatus("Disconnected");
    setParticipants([]);
    setRemoteStreams({});
    setMessages([]);
    setChatHistory([]);
    setIsConnecting(false);
    setCallType(null);
    setSelectedStaff(null);
    setShowStaffList(true);
    setIncomingCall(null);
    setTypingUsers({});
    attachedStreamsRef.current.clear();
    setRemoteVideoReady({});
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !replyingTo) return;

    if (!WebRTCService.isConnected()) {
      setError("Not connected to server. Please wait for reconnection.");
      return;
    }

    let message;

    if (WebRTCService.currentRoom) {
      message = WebRTCService.sendMessage(newMessage, "text");
    } else if (selectedStaff) {
      try {
        message = WebRTCService.sendDirectMessage(
          selectedStaff.userId,
          newMessage,
          "text",
        );

        message = {
          ...message,
          sender: {
            userId: user._id || user.id,
            username: user.username,
            role: user.role,
          },
        };
      } catch (error) {
        console.error("Failed to send direct message:", error);
        setError("Failed to send message");
      }
    }

    if (message) {
      setMessages((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        return [...current, message];
      });
    }

    setNewMessage("");
    setReplyingTo(null);
    scrollToBottom();

    handleTyping(false);
  };

  const handleTyping = (isTyping) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const socket = WebRTCService.socket;
    if (socket && WebRTCService.currentRoom) {
      socket.emit("typing", {
        roomId: WebRTCService.currentRoom,
        isTyping,
      });

      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit("typing", {
            roomId: WebRTCService.currentRoom,
            isTyping: false,
          });
        }, 3000);
      }
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress({ [file.name]: 0 });

    const interval = setInterval(() => {
      setUploadProgress((prev) => ({
        ...prev,
        [file.name]: Math.min((prev[file.name] || 0) + 10, 100),
      }));
    }, 500);

    try {
      const mediaUrl = URL.createObjectURL(file);

      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("audio/")
            ? "audio"
            : "file";

      let message;
      if (WebRTCService.currentRoom) {
        message = WebRTCService.sendMessage(file.name, fileType, mediaUrl);
      } else if (selectedStaff) {
        message = WebRTCService.sendDirectMessage(
          selectedStaff.userId,
          file.name,
          fileType,
          mediaUrl,
        );
      }

      if (message) {
        setMessages((prev) => {
          const current = Array.isArray(prev) ? prev : [];
          return [...current, message];
        });
      }

      clearInterval(interval);
      setUploadProgress({});
    } catch (error) {
      console.error("File upload error:", error);
      setError("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const addReaction = (messageId, reaction) => {
    WebRTCService.addReaction(messageId, reaction);
    setShowReactions(null);
  };

  const deleteMessage = (messageId) => {
    WebRTCService.deleteMessage(messageId);
    setShowMessageOptions(null);
    setMessageToDelete(null);
    setShowDeleteConfirm(false);
  };

  const clearChat = () => {
    if (WebRTCService.socket) {
      WebRTCService.socket.emit("clear-chat", {
        roomId: WebRTCService.currentRoom,
        userId: user._id || user.id,
      });
    }
    WebRTCService.clearMessages(WebRTCService.currentRoom);
    setMessages([]);
    setShowDeleteConfirm(false);
  };

  const toggleMessageSelection = (messageId) => {
    const newSelection = new Set(selectedMessages);
    if (newSelection.has(messageId)) {
      newSelection.delete(messageId);
    } else {
      newSelection.add(messageId);
    }
    setSelectedMessages(newSelection);
  };

  const deleteSelectedMessages = () => {
    selectedMessages.forEach((id) => deleteMessage(id));
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
  };

  const exportChat = () => {
    const messagesArray = Array.isArray(messages) ? messages : [];
    const chatText = messagesArray
      .map((msg) => {
        const time = new Date(msg.timestamp).toLocaleString();
        if (msg.system) return `[${time}] SYSTEM: ${msg.text}`;
        return `[${time}] ${msg.sender?.username}: ${msg.text}`;
      })
      .join("\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    setShowMessageOptions(null);
  };

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    WebRTCService.toggleAudio(newState);
    setIsAudioEnabled(newState);
  };

  const toggleVideo = () => {
    const newState = !isVideoEnabled;
    WebRTCService.toggleVideo(newState);
    setIsVideoEnabled(newState);
  };

  const setAudioOnlyMode = () => {
    if (isVideoEnabled) {
      WebRTCService.toggleVideo(false);
      setIsVideoEnabled(false);
    }

    if (!isAudioEnabled) {
      WebRTCService.toggleAudio(true);
      setIsAudioEnabled(true);
    }

    addSystemMessage("🎧 Switched to audio-only mode");
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        await WebRTCService.startScreenShare();
        setIsScreenSharing(true);
        addSystemMessage("🖥️ Started screen sharing");
      } else {
        await WebRTCService.stopScreenShare();
        setIsScreenSharing(false);
        addSystemMessage("🖥️ Stopped screen sharing");
      }
    } catch (error) {
      console.error("Screen share error:", error);
      setError(error.message);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getGridLayout = () => {
    const totalVideos = 1 + Object.keys(remoteStreams).length;

    if (totalVideos <= 2) return "grid-cols-1 md:grid-cols-2";
    if (totalVideos <= 4) return "grid-cols-1 md:grid-cols-2";
    if (totalVideos <= 6) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  };

  const renderMessageContent = (msg) => {
    if (!msg) return null;

    if (msg.type === "image") {
      return (
        <div>
          <img
            src={msg.mediaUrl}
            alt={msg.text}
            className="max-w-full rounded-lg cursor-pointer"
            style={{ maxHeight: '200px' }}
            onClick={() => setShowMediaViewer(msg.mediaUrl)}
          />
          {msg.text && <p className="text-sm mt-1">{msg.text}</p>}
        </div>
      );
    }

    if (msg.type === "video") {
      return (
        <div>
          <video
            src={msg.mediaUrl}
            className="max-w-full rounded-lg cursor-pointer"
            style={{ maxHeight: '200px' }}
            controls
            onClick={() => setShowMediaViewer(msg.mediaUrl)}
          />
          {msg.text && <p className="text-sm mt-1">{msg.text}</p>}
        </div>
      );
    }

    if (msg.type === "audio") {
      return (
        <div>
          <audio src={msg.mediaUrl} controls className="w-full" />
          {msg.text && <p className="text-sm mt-1">{msg.text}</p>}
        </div>
      );
    }

    if (msg.type === "file") {
      return (
        <div className="flex items-center space-x-2">
          <File size={20} />
          <a
            href={msg.mediaUrl}
            download={msg.text}
            className="text-sm underline"
          >
            {msg.text}
          </a>
        </div>
      );
    }

    return <p className="text-sm break-words">{msg.text}</p>;
  };

  const renderReactions = (msg) => {
    if (!msg || !msg.reactions) return null;

    const reactions = Object.entries(msg.reactions).filter(
      ([_, users]) => users && users.length > 0,
    );

    if (reactions.length === 0) return null;

    return (
      <div className="message-reactions">
        {reactions.map(([reaction, users]) => (
          <span
            key={reaction}
            className={`reaction-badge ${users.includes(user?._id || user?.id) ? "active" : ""}`}
            onClick={() => addReaction(msg.id, reaction)}
          >
            {reaction} {users.length}
          </span>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please log in to access video consultation
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>

      {/* Reconnecting Banner */}
      {status.includes("Reconnecting") && (
        <div className="reconnecting-overlay">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw size={16} className="animate-spin" />
            <span>{status}</span>
            {connectionAttempts > 0 && (
              <span className="text-xs bg-yellow-700 px-2 py-1 rounded">
                Attempt {connectionAttempts}/15
              </span>
            )}
          </div>
        </div>
      )}

      {/* Server Status Indicator */}
      <div className={`server-status ${serverStatus}`}>
        {serverStatus === "online" ? (
          <Wifi size={16} className="text-green-500" />
        ) : serverStatus === "offline" ? (
          <WifiOff size={16} className="text-red-500" />
        ) : (
          <RefreshCw size={16} className="text-yellow-500 animate-spin" />
        )}
        <span className="text-white text-sm">
          Server:{" "}
          {serverStatus === "online"
            ? "Online"
            : serverStatus === "offline"
              ? "Offline"
              : "Checking..."}
        </span>
        {transport !== "unknown" && (
          <span className="transport-badge text-gray-300">{transport}</span>
        )}
        {showReconnect && (
          <button
            onClick={attemptReconnect}
            disabled={reconnecting}
            className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 reconnect-button"
          >
            {reconnecting ? "Reconnecting..." : "Reconnect"}
          </button>
        )}
      </div>

      {/* Loading State */}
      {!isInitialized && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Initializing video consultation...</p>
          </div>
        </div>
      )}

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000]">
          <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border-2 border-purple-500 max-w-md w-full">
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                {incomingCall.callType === "audio" ? (
                  <PhoneCall size={48} className="text-white" />
                ) : (
                  <VideoIcon size={48} className="text-white" />
                )}
              </div>
              <h3 className="text-2xl text-white font-semibold mb-3">
                Incoming {incomingCall.callType} Call
              </h3>
              <p className="text-gray-300 text-lg mb-2">
                From: {incomingCall.from.username}
              </p>
              <p className="text-gray-400 mb-6">({incomingCall.from.role})</p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={acceptCall}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
                >
                  Accept
                </button>
                <button
                  onClick={rejectCall}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Viewer */}
      {showMediaViewer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[2000]"
          onClick={() => setShowMediaViewer(null)}
        >
          <div className="max-w-4xl max-h-[90vh]">
            {showMediaViewer.match(/\.(jpeg|jpg|gif|png)$/i) ? (
              <img
                src={showMediaViewer}
                alt="Media"
                className="max-w-full max-h-full"
              />
            ) : (
              <video
                src={showMediaViewer}
                controls
                autoPlay
                className="max-w-full max-h-full"
              />
            )}
          </div>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setShowMediaViewer(null)}
          >
            <X size={32} />
          </button>
        </div>
      )}

      {/* Selection Mode Toolbar */}
      {isSelectionMode && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full px-4 py-2 flex items-center space-x-4 z-50">
          <span className="text-white text-sm">
            {selectedMessages.size} selected
          </span>
          <button
            onClick={deleteSelectedMessages}
            className="text-red-500 hover:text-red-400"
            disabled={selectedMessages.size === 0}
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => {
              setIsSelectionMode(false);
              setSelectedMessages(new Set());
            }}
            className="text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md">
            <h3 className="text-xl text-white font-semibold mb-4">
              Delete Message
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this message?
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => {
                  if (messageToDelete === "all") {
                    clearChat();
                  } else if (messageToDelete) {
                    deleteMessage(messageToDelete);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setMessageToDelete(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={mainContainerRef}
        className="h-screen bg-gray-900 flex flex-col"
      >
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">Video Consultation</h1>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${WebRTCService.isConnected() ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              />
              <span className="text-sm text-gray-300">{status}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {WebRTCService.currentRoom && selectedStaff && (
              <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-1">
                <span className="text-sm">
                  In call with: {selectedStaff.username}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className={`p-2 rounded-lg transition-colors relative ${
                showParticipants ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
              title="Participants"
            >
              <Users size={18} />
              {participants.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {participants.length + 1}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg transition-colors relative ${
                showChat ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
              title="Chat"
            >
              <MessageCircle size={18} />
              {unreadCount > 0 && !showChat && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div
            className={`flex-1 p-4 transition-all duration-300 ${
              showChat ? "mr-80" : ""
            }`}
          >
            {!WebRTCService.currentRoom ? (
              <div className="h-full flex items-center justify-center">
                <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
                  <h2 className="text-xl text-white font-semibold mb-4">
                    Start a Consultation
                  </h2>

                  {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
                      {error}
                    </div>
                  )}

                  {serverStatus === "offline" && (
                    <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-200 rounded-lg">
                      Server is offline. Please check your connection and try
                      again.
                      <button
                        onClick={attemptReconnect}
                        disabled={reconnecting}
                        className="ml-2 px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 disabled:opacity-50"
                      >
                        {reconnecting ? "Reconnecting..." : "Reconnect"}
                      </button>
                    </div>
                  )}

                  <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">You:</span>{" "}
                      {user.username} ({user.role})
                    </p>
                    {transport !== "unknown" && (
                      <p className="text-xs text-gray-400 mt-1">
                        Connection: {transport}
                      </p>
                    )}
                  </div>

                  {showStaffList && (
                    <div className="mb-4">
                      <h3 className="text-white font-semibold mb-3">
                        Available Staff ({availableStaff.length})
                      </h3>

                      {availableStaff.length === 0 ? (
                        <div className="text-center py-8">
                          <User
                            size={48}
                            className="mx-auto text-gray-500 mb-3"
                          />
                          <p className="text-gray-400">
                            No staff available at the moment
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Please wait or try again later
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {availableStaff
                            .filter(
                              (staff) => staff.userId !== (user._id || user.id),
                            )
                            .map((staff) => (
                              <div
                                key={staff.userId}
                                className="bg-gray-700 rounded-lg p-3"
                              >
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {staff.username[0].toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-white font-medium">
                                      {staff.username}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {staff.role}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      setSelectedStaff(staff);
                                      setShowStaffList(false);
                                      setChatMode("private");
                                    }}
                                    disabled={serverStatus === "offline"}
                                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <MessageCircle size={16} />
                                    <span>Chat</span>
                                  </button>
                                  <button
                                    onClick={() => startCall(staff, "audio")}
                                    disabled={
                                      isConnecting || serverStatus === "offline"
                                    }
                                    className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-1"
                                  >
                                    <PhoneCall size={16} />
                                    <span>Audio</span>
                                  </button>
                                  <button
                                    onClick={() => startCall(staff, "video")}
                                    disabled={
                                      isConnecting || serverStatus === "offline"
                                    }
                                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-1"
                                  >
                                    <VideoIcon size={16} />
                                    <span>Video</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedStaff &&
                    chatMode === "private" &&
                    !WebRTCService.currentRoom && (
                      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-white font-medium">
                            Chatting with: {selectedStaff.username}
                          </p>
                          <button
                            onClick={() => {
                              setSelectedStaff(null);
                              setChatMode("room");
                              setMessages([]);
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="h-64 overflow-y-auto mb-3 p-2 bg-gray-800 rounded-lg">
                          {filteredMessages
                            .filter((m) => !m.system)
                            .map((msg) => (
                              <div
                                key={msg.id}
                                className={`mb-2 ${msg.sender?.userId === (user._id || user.id) ? "text-right" : "text-left"}`}
                              >
                                <div
                                  className={`inline-block max-w-[80%] px-3 py-2 rounded-lg ${
                                    msg.sender?.userId === (user._id || user.id)
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-600 text-white"
                                  }`}
                                >
                                  {msg.sender?.userId !==
                                    (user._id || user.id) && (
                                    <p className="text-xs font-semibold mb-1 text-gray-200">
                                      {msg.sender?.username}
                                    </p>
                                  )}
                                  {renderMessageContent(msg)}
                                  {renderReactions(msg)}
                                  <div className="flex items-center justify-end space-x-1 mt-1">
                                    <p className="text-xs opacity-75">
                                      {new Date(
                                        msg.timestamp,
                                      ).toLocaleTimeString()}
                                    </p>
                                    {msg.sender?.userId ===
                                      (user._id || user.id) && (
                                      <span className="message-status">
                                        {msg.read ? (
                                          <CheckCheck
                                            size={12}
                                            className="text-blue-400"
                                          />
                                        ) : (
                                          <Check
                                            size={12}
                                            className="text-gray-400"
                                          />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="flex space-x-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                            disabled={isUploading || serverStatus === "offline"}
                          >
                            <Paperclip size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors relative"
                            disabled={serverStatus === "offline"}
                          >
                            <Smile size={18} />
                            {showEmojiPicker && (
                              <div className="emoji-picker">
                                {emojis.map((emoji, index) => (
                                  <span
                                    key={index}
                                    className="emoji-item"
                                    onClick={() => addEmoji(emoji)}
                                  >
                                    {emoji}
                                  </span>
                                ))}
                              </div>
                            )}
                          </button>
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => {
                              setNewMessage(e.target.value);
                            }}
                            placeholder={`Message ${selectedStaff.username}...`}
                            className="flex-1 bg-gray-600 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            disabled={serverStatus === "offline"}
                          />
                          <button
                            type="submit"
                            disabled={
                              !newMessage.trim() ||
                              isUploading ||
                              serverStatus === "offline"
                            }
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send size={18} />
                          </button>
                        </form>
                        {isUploading && (
                          <div className="mt-2 relative h-1 bg-gray-600 rounded overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                              style={{
                                width: `${Object.values(uploadProgress)[0] || 0}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <>
                <div className={`grid ${getGridLayout()} gap-4 h-full`}>
                  {/* Local Video */}
                  <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video video-container">
                    <video
                      ref={(el) => {
                        if (el && !localVideoRef.current) {
                          localVideoRef.current = el;
                          if (WebRTCService.localStream && !el.srcObject) {
                            el.srcObject = WebRTCService.localStream;
                            el.play()
                              .then(() => {
                                setLocalVideoReady(true);
                              })
                              .catch(() => {});
                          }
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{
                        transform: "scaleX(-1) translateZ(0)",
                        backfaceVisibility: "hidden",
                      }}
                    />

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between video-overlay">
                      <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm flex items-center space-x-2">
                        <span>You ({user.username})</span>
                        {audioLevel > 0.1 && (
                          <div className="w-16 h-1 bg-gray-600 rounded overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{
                                width: `${Math.min(audioLevel * 100, 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {!isVideoEnabled && (
                        <div className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                          Video Off
                        </div>
                      )}
                    </div>

                    {!localVideoReady &&
                      isVideoEnabled &&
                      callType === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                          <div className="text-center text-gray-400">
                            <VideoOff size={32} className="mx-auto mb-2" />
                            <p className="text-sm">Camera initializing...</p>
                          </div>
                        </div>
                      )}

                    {callType === "audio" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
                        <div className="text-center text-white">
                          <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <PhoneCall size={48} />
                          </div>
                          <p className="text-lg font-semibold">Audio Call</p>
                          <p className="text-sm text-gray-400">
                            Camera is disabled for audio-only mode
                          </p>
                        </div>
                      </div>
                    )}

                    <div
                      className={`connection-indicator connection-${connectionQuality}`}
                    />
                    
                    {/* Debug info */}
                    <div className="debug-info">
                      {WebRTCService.localStream?.getVideoTracks().length > 0 ? '📹' : '🔊'}
                    </div>
                  </div>

                  {/* Remote Videos */}
                  {Object.entries(remoteStreams).map(([userId, stream]) => {
                    const participant = participants.find(
                      (p) => p.userId === userId,
                    );
                    const videoTracks = stream.getVideoTracks().length;
                    const audioTracks = stream.getAudioTracks().length;
                    
                    return (
                      <div
                        key={userId}
                        className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video video-container"
                      >
                        <video
                          ref={(el) => {
                            if (el) {
                              remoteVideosRef.current[userId] = el;
                              
                              // Always attach the stream when available
                              if (stream && stream.active) {
                                if (!el.srcObject || el.srcObject.id !== stream.id) {
                                  console.log(`🎥 Attaching remote stream for ${userId}`, {
                                    id: stream.id,
                                    videoTracks,
                                    audioTracks
                                  });
                                  
                                  el.srcObject = stream;
                                  
                                  // Important: Set muted to false to hear audio
                                  el.muted = false;
                                  
                                  // Play with error handling
                                  const playPromise = el.play();
                                  if (playPromise !== undefined) {
                                    playPromise
                                      .then(() => {
                                        console.log(`✅ Playing remote video for ${userId}`);
                                        const playBtn = document.getElementById(`play-btn-${userId}`);
                                        if (playBtn) playBtn.style.opacity = "0";
                                        setRemoteVideoReady(prev => ({ ...prev, [userId]: true }));
                                      })
                                      .catch(error => {
                                        console.log(`⚠️ Autoplay prevented for ${userId}:`, error);
                                        const playBtn = document.getElementById(`play-btn-${userId}`);
                                        if (playBtn) playBtn.style.opacity = "1";
                                        setRemoteVideoReady(prev => ({ ...prev, [userId]: false }));
                                      });
                                  }
                                }
                              }
                            }
                          }}
                          autoPlay
                          playsInline
                          controls={false}
                          muted={false}
                          className="w-full h-full object-cover"
                          style={{
                            transform: "scaleX(-1) translateZ(0)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            backgroundColor: "#2d2d2d",
                            minHeight: "200px",
                            willChange: "transform",
                          }}
                        />
                        
                        {/* Debug overlay */}
                        <div className="debug-info">
                          {videoTracks > 0 ? '📹' : '🔊'} 
                          {videoTracks > 0 && stream.getVideoTracks()[0]?.enabled ? '✓' : '✗'}
                        </div>
                        
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm z-10 video-overlay">
                          {participant?.username || "Remote User"} ({participant?.role || "staff"})
                          {!remoteVideoReady[userId] && videoTracks > 0 && (
                            <span className="ml-2 text-yellow-400">(paused)</span>
                          )}
                        </div>
                        
                        <button
                          id={`play-btn-${userId}`}
                          onClick={() => {
                            const videoEl = remoteVideosRef.current[userId];
                            if (videoEl) {
                              videoEl.play()
                                .then(() => {
                                  document.getElementById(`play-btn-${userId}`).style.opacity = "0";
                                  setRemoteVideoReady(prev => ({ ...prev, [userId]: true }));
                                })
                                .catch(e => console.error('Play failed:', e));
                            }
                          }}
                          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity play-button-overlay"
                          style={{ opacity: remoteVideoReady[userId] ? 0 : 1 }}
                        >
                          <div className="bg-blue-600 rounded-full p-4 text-white shadow-lg">
                            <Play size={24} />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2 shadow-lg">
                  <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-full transition-colors ${
                      isAudioEnabled
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    title={`${isAudioEnabled ? "Mute" : "Unmute"} (Ctrl+M)`}
                  >
                    {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>

                  {callType === "video" && (
                    <button
                      onClick={toggleVideo}
                      className={`p-3 rounded-full transition-colors ${
                        isVideoEnabled
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                      title={`${isVideoEnabled ? "Stop" : "Start"} Video (Ctrl+V)`}
                    >
                      {isVideoEnabled ? (
                        <Video size={20} />
                      ) : (
                        <VideoOff size={20} />
                      )}
                    </button>
                  )}

                  {callType === "video" && (
                    <button
                      onClick={setAudioOnlyMode}
                      className={`p-3 rounded-full transition-colors ${
                        !isVideoEnabled && isAudioEnabled
                          ? "bg-purple-600 hover:bg-purple-700 ring-2 ring-purple-400"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                      title="Audio Only Mode (Ctrl+A)"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}

                  {callType === "video" && (
                    <button
                      onClick={toggleScreenShare}
                      className={`p-3 rounded-full transition-colors ${
                        isScreenSharing
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
                    >
                      {isScreenSharing ? (
                        <MonitorDown size={20} />
                      ) : (
                        <MonitorUp size={20} />
                      )}
                    </button>
                  )}

                  <button
                    onClick={leaveCall}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                    title="End Call"
                  >
                    <PhoneOff size={20} />
                  </button>
                </div>
              </>
            )}
          </div>

          {showChat && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-white font-semibold">
                  {WebRTCService.currentRoom
                    ? "Room Chat"
                    : selectedStaff
                      ? `Chat with ${selectedStaff.username}`
                      : "Chat"}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className={`p-1 rounded-lg transition-colors ${showSearch ? "bg-blue-600" : "hover:bg-gray-700"}`}
                    title="Search"
                  >
                    <Search size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                    }
                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                    title={
                      sortOrder === "desc" ? "Newest first" : "Oldest first"
                    }
                  >
                    {sortOrder === "desc" ? (
                      <SortDesc size={16} />
                    ) : (
                      <SortAsc size={16} />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      setFilterType((prev) => {
                        if (prev === "all") return "text";
                        if (prev === "text") return "media";
                        if (prev === "media") return "system";
                        return "all";
                      })
                    }
                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                    title={`Filter: ${filterType}`}
                  >
                    <Filter size={16} />
                  </button>
                  <button
                    onClick={() => setIsSelectionMode(!isSelectionMode)}
                    className={`p-1 rounded-lg transition-colors ${isSelectionMode ? "bg-blue-600" : "hover:bg-gray-700"}`}
                    title="Select messages"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setMessageToDelete("all");
                      setShowDeleteConfirm(true);
                    }}
                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors text-red-400"
                    title="Clear chat"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={exportChat}
                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Export chat"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {showSearch && (
                <div className="p-2 border-b border-gray-700">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {Array.isArray(filteredMessages) &&
                filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.system
                          ? "items-center"
                          : msg.sender?.userId === (user._id || user.id)
                            ? "items-end"
                            : "items-start"
                      }`}
                      onMouseEnter={() =>
                        !isSelectionMode && setShowMessageOptions(msg.id)
                      }
                      onMouseLeave={() =>
                        !isSelectionMode && setShowMessageOptions(null)
                      }
                    >
                      {!msg.system && msg.sender && (
                        <div className="flex items-center space-x-2 mb-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                              msg.sender?.userId === (user._id || user.id) ? "bg-blue-600" : "bg-green-600"
                            }`}
                          >
                            {msg.sender.username?.[0]?.toUpperCase() || "?"}
                          </div>
                          <span className="text-xs font-semibold text-gray-300">
                            {msg.sender.username}
                          </span>
                          {msg.private && (
                            <span className="text-[10px] bg-purple-800 px-1 rounded text-white">
                              Private
                            </span>
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[90%] px-3 py-2 rounded-lg chat-message relative ${
                          msg.system
                            ? "bg-gray-700 text-gray-300 text-sm"
                            : msg.private
                              ? "bg-purple-600 text-white"
                              : msg.sender?.userId === (user._id || user.id)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 text-white"
                        }`}
                        onClick={() =>
                          isSelectionMode && toggleMessageSelection(msg.id)
                        }
                        style={{
                          cursor: isSelectionMode ? "pointer" : "default",
                          border: selectedMessages.has(msg.id)
                            ? "2px solid #3b82f6"
                            : "none",
                        }}
                      >
                        {showMessageOptions === msg.id && !isSelectionMode && (
                          <div className="message-options">
                            <button
                              onClick={() => setReplyingTo(msg)}
                              className="text-white hover:text-blue-300"
                              title="Reply"
                            >
                              <MessageCircle size={14} />
                            </button>
                            <button
                              onClick={() => setShowReactions(msg.id)}
                              className="text-white hover:text-yellow-300"
                              title="React"
                            >
                              <Smile size={14} />
                            </button>
                            <button
                              onClick={() => copyMessage(msg.text)}
                              className="text-white hover:text-green-300"
                              title="Copy"
                            >
                              <Copy size={14} />
                            </button>
                            {msg.sender?.userId === (user._id || user.id) && (
                              <>
                                <button
                                  onClick={() => setEditingMessage(msg)}
                                  className="text-white hover:text-blue-300"
                                  title="Edit"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M17 3l4 4-7 7H10v-4l7-7z M3 21l4-4" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    setMessageToDelete(msg.id);
                                    setShowDeleteConfirm(true);
                                  }}
                                  className="text-white hover:text-red-300"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {showReactions === msg.id && (
                          <div className="absolute bottom-full left-0 mb-1 bg-gray-700 rounded-lg p-1 flex space-x-1 z-50">
                            <button
                              onClick={() => addReaction(msg.id, "👍")}
                              className="hover:bg-gray-600 p-1 rounded"
                            >
                              👍
                            </button>
                            <button
                              onClick={() => addReaction(msg.id, "❤️")}
                              className="hover:bg-gray-600 p-1 rounded"
                            >
                              ❤️
                            </button>
                            <button
                              onClick={() => addReaction(msg.id, "😂")}
                              className="hover:bg-gray-600 p-1 rounded"
                            >
                              😂
                            </button>
                            <button
                              onClick={() => addReaction(msg.id, "😮")}
                              className="hover:bg-gray-600 p-1 rounded"
                            >
                              😮
                            </button>
                            <button
                              onClick={() => addReaction(msg.id, "😢")}
                              className="hover:bg-gray-600 p-1 rounded"
                            >
                              😢
                            </button>
                            <button
                              onClick={() => addReaction(msg.id, "👎")}
                              className="hover:bg-gray-600 p-1 rounded"
                            >
                              👎
                            </button>
                          </div>
                        )}

                        {replyingTo && replyingTo.id === msg.id && (
                          <div className="text-xs bg-gray-600 p-1 rounded mb-1">
                            Replying to {replyingTo.sender?.username}
                          </div>
                        )}

                        {renderMessageContent(msg)}
                        {renderReactions(msg)}

                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <span className="text-xs opacity-75">
                            {msg.timestamp
                              ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : ""}
                          </span>
                          {msg.sender?.userId === (user._id || user.id) &&
                            !msg.system && (
                              <span className="message-status">
                                {msg.read ? (
                                  <CheckCheck
                                    size={10}
                                    className="text-blue-400"
                                  />
                                ) : (
                                  <Check size={10} className="text-gray-400" />
                                )}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-8">
                    <MessageCircle size={48} className="mb-3 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs mt-1">Start the conversation</p>
                  </div>
                )}

                {Object.values(typingUsers).filter(Boolean).length > 0 && (
                  <div className="flex items-start">
                    <div className="typing-indicator">
                      {Object.values(typingUsers)
                        .filter(Boolean)
                        .map((name, i) => (
                          <span key={i} className="text-xs text-gray-400 mr-1">
                            {name}
                          </span>
                        ))}
                      <span className="text-xs text-gray-400">is typing</span>
                      <div className="flex space-x-1 ml-2">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={sendMessage}
                className="p-4 border-t border-gray-700"
              >
                {replyingTo && (
                  <div className="mb-2 p-2 bg-gray-700 rounded-lg flex justify-between items-center">
                    <span className="text-xs text-gray-300">
                      Replying to {replyingTo.sender?.username}:{" "}
                      {replyingTo.text?.substring(0, 30)}
                      {replyingTo.text?.length > 30 ? "..." : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <div className="flex space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={isUploading || serverStatus === "offline"}
                  >
                    <Paperclip size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors relative"
                    disabled={serverStatus === "offline"}
                  >
                    <Smile size={18} />
                    {showEmojiPicker && (
                      <div className="emoji-picker">
                        {emojis.map((emoji, index) => (
                          <span
                            key={index}
                            className="emoji-item"
                            onClick={() => addEmoji(emoji)}
                          >
                            {emoji}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      if (WebRTCService.currentRoom) {
                        handleTyping(e.target.value.length > 0);
                      }
                    }}
                    placeholder={
                      WebRTCService.currentRoom
                        ? "Type a message..."
                        : selectedStaff
                          ? `Message ${selectedStaff.username}...`
                          : "Select a staff to chat..."
                    }
                    className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    disabled={
                      (!WebRTCService.currentRoom && !selectedStaff) ||
                      isUploading ||
                      serverStatus === "offline"
                    }
                  />
                  <button
                    type="submit"
                    disabled={
                      !newMessage.trim() ||
                      (!WebRTCService.currentRoom && !selectedStaff) ||
                      isUploading ||
                      serverStatus === "offline"
                    }
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
                {isUploading && (
                  <div className="mt-2 relative h-1 bg-gray-600 rounded overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                      style={{
                        width: `${Object.values(uploadProgress)[0] || 0}%`,
                      }}
                    />
                  </div>
                )}
              </form>
            </div>
          )}

          {showParticipants && (
            <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">
                  Participants ({participants.length + 1})
                </h3>
                <button
                  onClick={() => setShowParticipants(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-400">{user.role} (You)</p>
                  </div>
                  <div className="flex space-x-1">
                    {isAudioEnabled ? (
                      <Mic size={14} className="text-green-500" />
                    ) : (
                      <MicOff size={14} className="text-red-500" />
                    )}
                    {isVideoEnabled && callType === "video" ? (
                      <Video size={14} className="text-green-500" />
                    ) : (
                      <VideoOff size={14} className="text-red-500" />
                    )}
                  </div>
                </div>

                {participants.map((participant) => (
                  <div
                    key={participant.userId}
                    className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {participant.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {participant.username}
                      </p>
                      <p className="text-xs text-gray-400">
                        {participant.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoConsultation;