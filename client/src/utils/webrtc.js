// /* eslint-disable no-dupe-class-members */
// /* eslint-disable no-undef */
// /* eslint-disable no-async-promise-executor */
// /* eslint-disable no-unused-vars */

// // utils/webrtc.js
// import { io } from "socket.io-client";

// class WebRTCService {
//   constructor() {
//     // Core properties
//     this.socket = null;
//     this.peerConnections = new Map();
//     this.socketIdToUserId = new Map();
//     this.localStream = null;
//     this.remoteStreams = new Map();
//     this.currentRoom = null;
//     this.currentUser = null;
//     this.currentCallType = null;
//     this.reconnectAttempts = 0;
//     this.maxReconnectAttempts = 3;
//     this.availableStaff = [];
//     this.directMessages = [];
//     this.pendingCalls = new Map();
//     this.messageHistory = new Map();
//     this.pendingCallData = null;
//     this.pendingIceCandidates = new Map();
//     this.connectionInProgress = new Set();
//     this.serverUrl = null;
//     this.productionUrl = "https://library-server-5rpq.onrender.com";
//     this.videoTrackEnabled = true;

//     // Callbacks
//     this.onUserJoined = null;
//     this.onUserLeft = null;
//     this.onMessageReceived = null;
//     this.onDirectMessageReceived = null;
//     this.onRemoteStream = null;
//     this.onConnectionStateChange = null;
//     this.onAudioLevelChange = null;
//     this.onStaffListUpdate = null;
//     this.onCallRejected = null;
//     this.onIncomingCall = null;

//     // Configuration
//     this.config = {
//       iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         { urls: "stun:stun1.l.google.com:19302" },
//         { urls: "stun:stun2.l.google.com:19302" },
//         { urls: "stun:stun3.l.google.com:19302" },
//         { urls: "stun:stun4.l.google.com:19302" },
//         { urls: "stun:stun.services.mozilla.com" },
//         {
//           urls: "turn:openrelay.metered.ca:80",
//           username: "openrelayproject",
//           credential: "openrelayproject",
//         },
//       ],
//       iceCandidatePoolSize: 10,
//     };
//   }

//   // Helper method to get the correct server URL
//   getServerUrl() {
//     if (this.serverUrl) return this.serverUrl;

//     if (typeof window !== "undefined") {
//       const hostname = window.location.hostname;
//       console.log("Current hostname:", hostname);

//       if (hostname.includes("render.com") || !hostname.includes("localhost")) {
//         this.serverUrl = this.productionUrl;
//         console.log("Using production server URL:", this.serverUrl);
//         return this.serverUrl;
//       }
//     }

//     if (typeof process !== "undefined" && process.env) {
//       if (process.env.REACT_APP_SERVER_URL) {
//         this.serverUrl = process.env.REACT_APP_SERVER_URL;
//         console.log("Using server URL from env:", this.serverUrl);
//         return this.serverUrl;
//       }
//     }

//     this.serverUrl = "http://localhost:5000";
//     console.log("Using local server URL:", this.serverUrl);
//     return this.serverUrl;
//   }

//   // Health check method
//   async checkServerHealth() {
//     try {
//       const baseUrl = this.getServerUrl();
//       const endpoints = [
//         `${baseUrl}/health`,
//         `${baseUrl}/api/health`,
//         `${baseUrl}`,
//         `${baseUrl}/socket.io/socket.io.js`,
//       ];

//       for (const url of endpoints) {
//         try {
//           console.log("Checking server health at:", url);
//           const response = await fetch(url, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             mode: "cors",
//             cache: "no-cache",
//             signal: AbortSignal.timeout(5000),
//           });

//           if (response.ok) {
//             console.log("Server health check passed at:", url);
//             return true;
//           }
//         } catch (e) {
//           console.log(`Health check failed for ${url}:`, e.message);
//         }
//       }

//       try {
//         const response = await fetch(baseUrl, {
//           method: "GET",
//           mode: "cors",
//           signal: AbortSignal.timeout(5000),
//         });
//         if (response.ok) {
//           console.log("Base URL health check passed");
//           return true;
//         }
//       } catch (e) {
//         console.log("Base URL health check failed:", e.message);
//       }

//       console.log("All health checks failed");
//       return false;
//     } catch (error) {
//       console.error("Server health check failed:", error.message);
//       return false;
//     }
//   }

//   initialize(userId, username, role) {
//     if (this.socket?.connected) {
//       if (this.pendingCallData && this.onIncomingCall) {
//         this.onIncomingCall(this.pendingCallData);
//       }
//       return this.socket;
//     }

//     console.log("Initializing WebRTC with:", { userId, username, role });

//     const serverUrl = this.getServerUrl();
//     console.log("Connecting to Socket.IO server:", serverUrl);

//     this.socket = io(serverUrl, {
//       query: { userId, username, role },
//       transports: ["polling", "websocket"],
//       reconnection: true,
//       reconnectionAttempts: 15,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 10000,
//       timeout: 30000,
//       withCredentials: true,
//       forceNew: true,
//       rememberUpgrade: true,
//       upgrade: true,
//       rejectUnauthorized: false,
//       autoConnect: true,
//       randomizationFactor: 0.5,
//     });

//     this.currentUser = { userId, username, role };
//     this._setupListeners();

//     setTimeout(() => {
//       this.checkServerHealth().then((isHealthy) => {
//         console.log("Initial health check result:", isHealthy);
//         if (!isHealthy && this.onConnectionStateChange) {
//           this.onConnectionStateChange({
//             state: "warning",
//             data: "Server health check failed, but attempting connection...",
//           });
//         }
//       });
//     }, 1000);

//     return this.socket;
//   }

//   _setupListeners() {
//     this.socket.on("connect", () => {
//       console.log(
//         "✅ Connected to server with transport:",
//         this.socket.io.engine.transport.name,
//       );
//       this._handleStateChange("connected");
//       this.reconnectAttempts = 0;

//       if (this.socket && this.currentUser) {
//         this.socketIdToUserId.set(this.socket.id, this.currentUser.userId);
//       }

//       this.socket.emit("request-staff-list");
//       this.socket.emit("request-message-history", this.currentUser.userId);

//       if (this.socket.io.engine.transport.name === "polling") {
//         console.log(
//           "Currently using polling, attempting to upgrade to websocket...",
//         );
//         setTimeout(() => {
//           if (this.socket && this.socket.io) {
//             this.socket.io.opts.transports = ["polling", "websocket"];
//           }
//         }, 2000);
//       }

//       if (this.pendingCallData && this.onIncomingCall) {
//         this.onIncomingCall(this.pendingCallData);
//       }
//     });

//     this.socket.on("disconnect", (reason) => {
//       console.log("❌ Disconnected:", reason);
//       this._handleStateChange("disconnected", reason);
//       this.socketIdToUserId.clear();
//       this._cleanupAllPeerConnections();

//       if (reason === "io server disconnect" || reason === "transport close") {
//         console.log("Server disconnected, attempting to reconnect...");
//         setTimeout(() => {
//           if (this.socket && !this.socket.connected) {
//             this.socket.connect();
//           }
//         }, 1000);
//       }
//     });

//     this.socket.on("connect_error", (error) => {
//       console.error("🔴 Connection error:", error);
//       this._handleStateChange("error", error.message);

//       console.log("Connection error details:", {
//         message: error.message,
//         type: error.type,
//         description: error.description,
//       });

//       if (this.socket && this.socket.io) {
//         console.log("Switching to polling only transport...");
//         this.socket.io.opts.transports = ["polling"];
//       }
//     });

//     this.socket.on("reconnect_attempt", (attempt) => {
//       console.log(`🔄 Reconnection attempt ${attempt}`);
//       this._handleStateChange("reconnecting", `Attempt ${attempt}`);
//     });

//     this.socket.on("reconnect", () => {
//       console.log("✅ Reconnected to server");
//       this._handleStateChange("reconnected");

//       if (this.currentUser) {
//         this.socket.emit("request-staff-list");
//         this.socket.emit("request-message-history", this.currentUser.userId);
//       }
//     });

//     this.socket.on("reconnect_error", (error) => {
//       console.error("Reconnection error:", error);
//       this._handleStateChange("reconnect_error", error.message);
//     });

//     this.socket.on("reconnect_failed", () => {
//       console.error("Reconnection failed after all attempts");
//       this._handleStateChange(
//         "reconnect_failed",
//         "Could not reconnect to server",
//       );
//     });

//     this.socket.on("ping", () => {
//       console.log("🏓 Ping received");
//     });

//     this.socket.on("pong", (latency) => {
//       console.log("🏓 Pong received, latency:", latency, "ms");
//     });

//     this.socket.on("staff-list", (staffList) => {
//       console.log("📋 Available staff:", staffList);
//       this.availableStaff = Array.isArray(staffList) ? staffList : [];
//       this.onStaffListUpdate?.(this.availableStaff);
//     });

//     this.socket.on("staff-available", (staff) => {
//       console.log("🟢 Staff available:", staff.username);
//       this.availableStaff = [...this.availableStaff, staff];
//       this.onStaffListUpdate?.(this.availableStaff);
//     });

//     this.socket.on("staff-unavailable", (data) => {
//       const staffId = typeof data === "string" ? data : data.userId;
//       console.log("🔴 Staff unavailable:", staffId);
//       this.availableStaff = this.availableStaff.filter(
//         (s) => s.userId !== staffId,
//       );
//       this.onStaffListUpdate?.(this.availableStaff);
//     });

//     this.socket.on("message-history", (data) => {
//       console.log("📜 Received message history");
//       const history = Array.isArray(data) ? data : data?.roomHistories || [];
//       history.forEach((msg) => {
//         const key = msg.roomId || msg.conversationId || "direct";
//         if (!this.messageHistory.has(key)) {
//           this.messageHistory.set(key, []);
//         }
//         this.messageHistory.get(key).push(msg);
//       });
//     });

//     this.socket.on("direct-message", (message) => {
//       console.log("💬 Direct message received:", message);
//       this.directMessages.push(message);

//       if (message.sender && this.currentUser) {
//         const conversationId = [this.currentUser.userId, message.sender.userId]
//           .sort()
//           .join("-");
//         if (!this.messageHistory.has(conversationId)) {
//           this.messageHistory.set(conversationId, []);
//         }
//         this.messageHistory.get(conversationId).push(message);
//       }

//       this.onDirectMessageReceived?.(message);
//     });

//     this.socket.on("user-joined", async (data) => {
//       console.log("👥 User joined:", data.username);

//       this.socketIdToUserId.set(data.socketId, data.userId);

//       if (data.userId !== this.currentUser?.userId) {
//         if (this.currentUser?.userId < data.userId) {
//           console.log("Creating offer because userId is smaller");
//           setTimeout(() => this._createOffer(data.userId), 1000);
//         } else {
//           console.log("Waiting for offer from other user");
//         }
//       }
//       this.onUserJoined?.(data);
//     });

//     this.socket.on("user-left", (data) => {
//       console.log("👋 User left:", data.username);
//       this.socketIdToUserId.delete(data.socketId);
//       this._cleanupPeerConnection(data.userId);
//       this.connectionInProgress.delete(data.userId);
//       this.onUserLeft?.(data);
//     });

//     this.socket.on("call-initiated", ({ from, roomId, callType }) => {
//       console.log(`📞 Incoming ${callType} call from:`, from);
//       const callData = { from, roomId, callType };
//       this.pendingCallData = callData;
//       this.pendingCalls.set(from.userId, callData);

//       if (this.onIncomingCall) {
//         this.onIncomingCall(callData);
//       }
//     });

//     this.socket.on("call-rejected", ({ from, callType }) => {
//       console.log(`❌ Call rejected by:`, from);
//       this.pendingCalls.delete(from.userId);
//       if (this.pendingCallData?.from.userId === from.userId) {
//         this.pendingCallData = null;
//       }
//       this.onCallRejected?.(from, callType);
//     });

//     this.socket.on("call-accepted", ({ from, roomId, callType }) => {
//       console.log(`✅ Call accepted by:`, from);
//       if (this.currentRoom !== roomId) {
//         this.currentRoom = roomId;
//         this.currentCallType = callType;
//         this.socket.emit("join-room", { roomId, callType });
//       }
//     });

//     this.socket.on("room-joined", (data) => {
//       console.log("🚪 Joined room:", data.roomId);
//       this._handleStateChange("room_joined", data.roomId);

//       this.pendingCalls.clear();
//       this.pendingCallData = null;

//       if (data.chatHistory) {
//         const history = Array.isArray(data.chatHistory) ? data.chatHistory : [];
//         this.messageHistory.set(data.roomId, history);
//         history.forEach((msg) => {
//           this.onMessageReceived?.(msg);
//         });
//       }

//       if (data.participants) {
//         const participants = Array.isArray(data.participants)
//           ? data.participants
//           : [];
//         participants.forEach((p) => {
//           const targetUserId = p.userId;
//           if (targetUserId && targetUserId !== this.currentUser?.userId) {
//             if (this.currentUser?.userId < targetUserId) {
//               setTimeout(() => this._createOffer(targetUserId), 1500);
//             }
//           }
//         });
//       }
//     });

//     this.socket.on(
//       "offer",
//       async ({ from, fromUserId, fromUsername, offer }) => {
//         console.log("📞 Received offer from:", fromUsername);
//         this.socketIdToUserId.set(from, fromUserId);

//         if (this.connectionInProgress.has(fromUserId)) {
//           console.log("Connection already in progress for:", fromUserId);
//           return;
//         }

//         this.connectionInProgress.add(fromUserId);

//         try {
//           await this._handleOffer(fromUserId, offer);
//         } catch (error) {
//           console.error("Error handling offer:", error);
//           this.connectionInProgress.delete(fromUserId);
//         }
//       },
//     );

//     this.socket.on("answer", ({ from, fromUsername, answer }) => {
//       console.log("📞 Received answer from:", fromUsername);
//       const fromUserId = this.socketIdToUserId.get(from) || from;
//       this._handleAnswer(fromUserId, answer);
//     });

//     this.socket.on("ice-candidate", ({ from, fromUsername, candidate }) => {
//       console.log("❄️ Received ICE candidate from:", fromUsername);
//       const fromUserId = this.socketIdToUserId.get(from) || from;
//       this._handleIceCandidate(fromUserId, candidate);
//     });

//     this.socket.on("receive-message", (message) => {
//       console.log("💬 Room message received:", message);
//       if (message.roomId) {
//         if (!this.messageHistory.has(message.roomId)) {
//           this.messageHistory.set(message.roomId, []);
//         }
//         this.messageHistory.get(message.roomId).push(message);
//       }
//       this.onMessageReceived?.(message);
//     });

//     this.socket.on("message-reaction", ({ messageId, reaction, userId }) => {
//       console.log("👍 Message reaction:", { messageId, reaction, userId });
//       this.messageHistory.forEach((messages) => {
//         const msg = messages.find((m) => m.id === messageId);
//         if (msg) {
//           if (!msg.reactions) msg.reactions = {};
//           if (!msg.reactions[reaction]) msg.reactions[reaction] = [];
//           if (!msg.reactions[reaction].includes(userId)) {
//             msg.reactions[reaction].push(userId);
//           }
//         }
//       });
//     });

//     this.socket.on("message-deleted", ({ messageId }) => {
//       console.log("🗑️ Message deleted:", messageId);
//       this.messageHistory.forEach((messages, key) => {
//         const index = messages.findIndex((m) => m.id === messageId);
//         if (index !== -1) {
//           messages.splice(index, 1);
//         }
//       });
//     });
//   }

//   _handleAnswer(userId, answer) {
//     const pc = this.peerConnections.get(userId);
//     if (!pc) {
//       console.log(`No peer connection for ${userId}, cannot set answer`);
//       return;
//     }

//     if (pc.signalingState === "have-local-offer") {
//       pc.setRemoteDescription(new RTCSessionDescription(answer))
//         .then(() => {
//           console.log(`✅ Remote description set for ${userId}`);

//           const pendingCandidates = this.pendingIceCandidates.get(userId) || [];
//           pendingCandidates.forEach((candidate) => {
//             pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
//               console.error("Error adding pending ICE candidate:", err),
//             );
//           });
//           this.pendingIceCandidates.delete(userId);

//           this.connectionInProgress.delete(userId);
//         })
//         .catch((err) => {
//           console.error("Error setting remote description:", err);
//           this.connectionInProgress.delete(userId);
//         });
//     } else {
//       console.log(
//         `Cannot set answer, current signaling state: ${pc.signalingState}`,
//       );
//       this.connectionInProgress.delete(userId);
//     }
//   }

//   _handleIceCandidate(userId, candidate) {
//     const pc = this.peerConnections.get(userId);

//     if (!pc) {
//       console.log(`No peer connection for ${userId}, cannot add ICE candidate`);
//       return;
//     }

//     if (!pc.currentRemoteDescription && !pc.remoteDescription) {
//       console.log(
//         `Remote description not set yet, queuing ICE candidate for ${userId}`,
//       );
//       if (!this.pendingIceCandidates.has(userId)) {
//         this.pendingIceCandidates.set(userId, []);
//       }
//       this.pendingIceCandidates.get(userId).push(candidate);
//       return;
//     }

//     pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
//       console.error("Error adding ICE candidate:", err),
//     );
//   }

//   sendDirectMessage(targetUserId, text, messageType = "text", mediaUrl = null) {
//     if (!this.socket?.connected) {
//       throw new Error("Socket not connected");
//     }

//     const message = {
//       id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       text,
//       type: messageType,
//       mediaUrl,
//       sender: this.currentUser,
//       timestamp: new Date().toISOString(),
//       private: true,
//       reactions: {},
//       read: false,
//     };

//     this.socket.emit("direct-message", {
//       to: targetUserId,
//       message,
//     });

//     if (this.currentUser) {
//       const conversationId = [this.currentUser.userId, targetUserId]
//         .sort()
//         .join("-");
//       if (!this.messageHistory.has(conversationId)) {
//         this.messageHistory.set(conversationId, []);
//       }
//       this.messageHistory.get(conversationId).push(message);
//     }

//     return message;
//   }

//   sendMessage(text, messageType = "text", mediaUrl = null) {
//     if (!this.currentRoom) return null;

//     const message = {
//       id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       text,
//       type: messageType,
//       mediaUrl,
//       roomId: this.currentRoom,
//       sender: this.currentUser,
//       timestamp: new Date().toISOString(),
//       reactions: {},
//     };

//     this.socket.emit("send-message", message);

//     if (!this.messageHistory.has(this.currentRoom)) {
//       this.messageHistory.set(this.currentRoom, []);
//     }
//     this.messageHistory.get(this.currentRoom).push(message);

//     return message;
//   }

//   addReaction(messageId, reaction) {
//     if (!this.socket?.connected) return;
//     this.socket.emit("message-reaction", {
//       messageId,
//       reaction,
//       userId: this.currentUser?.userId,
//     });
//   }

//   deleteMessage(messageId) {
//     if (!this.socket?.connected) return;
//     this.socket.emit("delete-message", {
//       messageId,
//       userId: this.currentUser?.userId,
//     });
//   }

//   async startCall(targetUserId, callType = "video") {
//     if (!this.socket?.connected) {
//       throw new Error("Socket not connected");
//     }

//     this._cleanupPeerConnection(targetUserId);
//     this.currentCallType = callType;

//     return new Promise(async (resolve, reject) => {
//       const timeout = setTimeout(() => {
//         reject(new Error("Call initiation timeout"));
//       }, 30000);

//       try {
//         console.log(`📹 Setting up local stream for ${callType} call...`);

//         // IMPORTANT: For video calls, make sure we request video
//         await this._setupLocalStream(callType === "video", true);

//         console.log("✅ Local stream setup complete");
//         console.log("Local stream details:", {
//           videoTracks: this.localStream?.getVideoTracks().length || 0,
//           audioTracks: this.localStream?.getAudioTracks().length || 0,
//         });

//         // Verify video track is present for video calls
//         if (callType === "video") {
//           const videoTrack = this.localStream?.getVideoTracks()[0];
//           if (!videoTrack) {
//             throw new Error("No video track available for video call");
//           }
//           console.log("Video track available:", {
//             enabled: videoTrack.enabled,
//             readyState: videoTrack.readyState,
//             settings: videoTrack.getSettings(),
//           });
//         }

//         const roomId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

//         console.log(`📞 Initiating call to ${targetUserId}`);
//         this.socket.emit("initiate-call", {
//           targetUserId,
//           roomId,
//           callType,
//         });

//         console.log(`🚪 Joining room: ${roomId}`);
//         this.socket.emit("join-room", {
//           roomId,
//           callType,
//         });

//         this.socket.once("room-joined", (data) => {
//           clearTimeout(timeout);
//           console.log("Call started successfully:", data);
//           this.currentRoom = roomId;
//           resolve(data);
//         });
//       } catch (error) {
//         clearTimeout(timeout);
//         console.error("❌ Error starting call:", error);
//         reject(error);
//       }
//     });
//   }

//   rejectCall(fromUserId, callType) {
//     if (!this.socket?.connected) return;
//     this.socket.emit("reject-call", {
//       from: fromUserId,
//       callType,
//     });
//     this.pendingCalls.delete(fromUserId);
//     if (this.pendingCallData?.from.userId === fromUserId) {
//       this.pendingCallData = null;
//     }
//   }

//   async acceptCall(roomId, callType) {
//     if (!this.socket?.connected) {
//       throw new Error("Socket not connected");
//     }

//     this.currentCallType = callType;
//     this.currentRoom = roomId;

//     return new Promise(async (resolve, reject) => {
//       const timeout = setTimeout(() => {
//         reject(new Error("Call acceptance timeout"));
//       }, 30000);

//       try {
//         console.log(`📹 Setting up local stream for ${callType} call...`);
//         await this._setupLocalStream(callType === "video", true);
//         console.log("✅ Local stream setup complete");

//         const callerUserId = Array.from(this.pendingCalls.keys())[0];
//         if (callerUserId) {
//           this.socket.emit("accept-call", {
//             from: callerUserId,
//             roomId,
//             callType,
//           });
//         }

//         this.socket.emit("join-room", {
//           roomId,
//           callType,
//         });

//         this.socket.once("room-joined", (data) => {
//           clearTimeout(timeout);
//           console.log("Call joined successfully:", data);
//           this.pendingCallData = null;
//           resolve(data);
//         });
//       } catch (error) {
//         clearTimeout(timeout);
//         console.error("❌ Error accepting call:", error);
//         reject(error);
//       }
//     });
//   }

//   async _setupLocalStream(video = true, audio = true) {
//     if (this.localStream) {
//       const hasVideo = this.localStream.getVideoTracks().length > 0;
//       const hasAudio = this.localStream.getAudioTracks().length > 0;

//       if (
//         (video && !hasVideo) ||
//         (!video && hasVideo) ||
//         (audio && !hasAudio) ||
//         (!audio && hasAudio)
//       ) {
//         console.log("Recreating stream for different media type");
//         this.localStream.getTracks().forEach((track) => track.stop());
//         this.localStream = null;
//       } else {
//         console.log("Using existing stream");
//         return this.localStream;
//       }
//     }

//     try {
//       if (!navigator.mediaDevices?.getUserMedia) {
//         throw new Error("Browser doesn't support video/audio");
//       }

//       console.log(
//         `Requesting ${video ? "camera and " : ""}microphone access...`,
//       );

//       // Enhanced video constraints for better compatibility
//       const constraints = {
//         video: video
//           ? {
//               width: { ideal: 1280, min: 640 },
//               height: { ideal: 720, min: 480 },
//               facingMode: "user",
//               frameRate: { ideal: 30, min: 15 },
//               // Add these for better compatibility
//               aspectRatio: { ideal: 16 / 9 },
//               resizeMode: "crop-and-scale",
//             }
//           : false,
//         audio: audio
//           ? {
//               echoCancellation: true,
//               noiseSuppression: true,
//               autoGainControl: true,
//               sampleRate: { ideal: 48000 },
//               channelCount: { ideal: 2 },
//             }
//           : false,
//       };

//       console.log("Using constraints:", constraints);

//       this.localStream = await navigator.mediaDevices.getUserMedia(constraints);

//       console.log("✅ Media access granted!");
//       console.log("Video tracks:", this.localStream.getVideoTracks().length);
//       console.log("Audio tracks:", this.localStream.getAudioTracks().length);

//       // Enable all tracks explicitly
//       this.localStream.getTracks().forEach((track) => {
//         track.enabled = true;
//         console.log(`Track ${track.kind} enabled:`, track.enabled);
//       });

//       this._setupAudioMonitoring();

//       return this.localStream;
//     } catch (error) {
//       console.error("❌ Media setup error:", error);

//       let errorMessage = "Failed to access camera/microphone";
//       if (error.name === "NotAllowedError") {
//         errorMessage =
//           "Camera/Microphone access denied. Please allow permissions.";
//       } else if (error.name === "NotFoundError") {
//         errorMessage = "No camera or microphone found on this device.";
//       } else if (error.name === "NotReadableError") {
//         errorMessage = "Camera/Microphone is in use by another application.";
//       } else if (error.name === "OverconstrainedError") {
//         errorMessage = "Camera doesn't support required settings.";
//       } else if (error.name === "TypeError") {
//         errorMessage = "Invalid media constraints. Please check your device.";
//       }

//       throw new Error(errorMessage);
//     }
//   }

//   _setupAudioMonitoring() {
//     if (!this.localStream || !window.AudioContext) return;

//     try {
//       const audioContext = new (
//         window.AudioContext || window.webkitAudioContext
//       )();
//       const analyser = audioContext.createAnalyser();
//       analyser.fftSize = 256;
//       analyser.smoothingTimeConstant = 0.3;

//       const source = audioContext.createMediaStreamSource(this.localStream);
//       source.connect(analyser);

//       const dataArray = new Uint8Array(analyser.frequencyBinCount);

//       const checkAudioLevel = () => {
//         if (!this.localStream || !this.socket?.connected) return;

//         analyser.getByteFrequencyData(dataArray);
//         const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
//         const normalizedLevel = average / 255;

//         this.onAudioLevelChange?.(normalizedLevel);

//         requestAnimationFrame(checkAudioLevel);
//       };

//       checkAudioLevel();
//     } catch (error) {
//       console.error("Error setting up audio monitoring:", error);
//     }
//   }

//   _createPeerConnection(userId) {
//     if (this.peerConnections.has(userId)) {
//       this._cleanupPeerConnection(userId);
//     }

//     console.log(`Creating peer connection for ${userId}`);

//     const pc = new RTCPeerConnection({
//       iceServers: this.config.iceServers,
//       iceCandidatePoolSize: this.config.iceCandidatePoolSize,
//       // Add these for better video performance
//       bundlePolicy: "max-bundle",
//       rtcpMuxPolicy: "require",
//       iceTransportPolicy: "all",
//     });

//     if (this.localStream) {
//       this.localStream.getTracks().forEach((track) => {
//         console.log(
//           `Adding ${track.kind} track to peer connection for ${userId}`,
//         );

//         // For video tracks, add with specific transceiver options
//         if (track.kind === "video") {
//           const transceiver = pc.addTransceiver(track, {
//             direction: "sendrecv",
//             streams: [this.localStream],
//             sendEncodings: [
//               { rid: "high", maxBitrate: 900000 },
//               { rid: "medium", maxBitrate: 300000, scaleResolutionDownBy: 2.0 },
//               { rid: "low", maxBitrate: 120000, scaleResolutionDownBy: 4.0 },
//             ],
//           });
//           console.log("Video transceiver added:", transceiver);
//         } else {
//           pc.addTrack(track, this.localStream);
//         }
//       });
//     } else {
//       console.warn(
//         `No local stream available when creating peer connection for ${userId}`,
//       );
//     }

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         console.log(`❄️ Sending ICE candidate for ${userId}`);
//         this.socket.emit("ice-candidate", {
//           to: userId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     pc.oniceconnectionstatechange = () => {
//       console.log(`❄️ ICE state with ${userId}:`, pc.iceConnectionState);

//       if (
//         pc.iceConnectionState === "connected" ||
//         pc.iceConnectionState === "completed"
//       ) {
//         console.log(`✅ Connection established with ${userId}`);
//       } else if (pc.iceConnectionState === "failed") {
//         console.log(`❌ Connection failed with ${userId}`);
//         pc.restartIce();
//       } else if (pc.iceConnectionState === "disconnected") {
//         console.log(`⚠️ Connection disconnected with ${userId}`);
//       } else if (pc.iceConnectionState === "closed") {
//         console.log(`🔒 Connection closed with ${userId}`);
//         this.connectionInProgress.delete(userId);
//       }
//     };

//     pc.onconnectionstatechange = () => {
//       console.log(`🔌 Connection state with ${userId}:`, pc.connectionState);
//       if (pc.connectionState === "connected") {
//         this.connectionInProgress.delete(userId);
//       }
//     };

//     pc.ontrack = (event) => {
//       console.log(`📡 Received ${event.track.kind} track from:`, userId);
//       console.log(
//         `   Track enabled: ${event.track.enabled}, readyState: ${event.track.readyState}`,
//       );

//       const [stream] = event.streams;

//       if (stream) {
//         console.log("Remote stream details:", {
//           id: stream.id,
//           active: stream.active,
//           videoTracks: stream.getVideoTracks().length,
//           audioTracks: stream.getAudioTracks().length,
//         });

//         const videoTrack = stream.getVideoTracks()[0];
//         if (videoTrack) {
//           console.log(`   Video track settings:`, videoTrack.getSettings());
//           console.log(
//             `   Video track constraints:`,
//             videoTrack.getConstraints(),
//           );

//           // Ensure video track is enabled
//           videoTrack.enabled = true;
//         }

//         this.remoteStreams.set(userId, stream);
//         this.onRemoteStream?.(userId, stream);
//       }
//     };

//     pc.onnegotiationneeded = () => {
//       console.log(`🔄 Negotiation needed for ${userId}`);
//     };

//     this.peerConnections.set(userId, pc);
//     return pc;
//   }

//   async _createOffer(userId) {
//     if (this.connectionInProgress.has(userId)) {
//       console.log(
//         `Connection already in progress for ${userId}, skipping offer creation`,
//       );
//       return;
//     }

//     this.connectionInProgress.add(userId);

//     try {
//       if (!this.localStream) {
//         console.log(`No local stream, creating one before offer to ${userId}`);
//         await this._setupLocalStream(this.currentCallType === "video", true);
//       }

//       if (this.currentCallType === "video") {
//         const videoTrack = this.localStream?.getVideoTracks()[0];
//         if (!videoTrack) {
//           console.warn(`No video track available for video call to ${userId}`);
//         } else {
//           console.log(`Video track available for ${userId}:`, {
//             enabled: videoTrack.enabled,
//             readyState: videoTrack.readyState,
//             settings: videoTrack.getSettings(),
//           });
//         }
//       }

//       let pc = this.peerConnections.get(userId);
//       if (!pc) {
//         pc = this._createPeerConnection(userId);
//       }

//       if (pc.signalingState !== "stable") {
//         console.log(
//           `Signaling state not stable for ${userId}, current state:`,
//           pc.signalingState,
//         );
//         await new Promise((resolve) => {
//           const checkState = () => {
//             if (pc.signalingState === "stable") {
//               resolve();
//             } else {
//               setTimeout(checkState, 100);
//             }
//           };
//           checkState();
//         });
//       }

//       console.log(`Creating offer for ${userId}`);
//       const offer = await pc.createOffer({
//         offerToReceiveAudio: true,
//         offerToReceiveVideo: this.currentCallType === "video",
//         iceRestart: true,
//         voiceActivityDetection: true,
//       });

//       await pc.setLocalDescription(offer);

//       console.log(`📞 Sending offer to user:`, userId);
//       this.socket.emit("offer", {
//         to: userId,
//         offer: pc.localDescription,
//       });
//     } catch (error) {
//       console.error("Error creating offer:", error);
//       this.connectionInProgress.delete(userId);
//     }
//   }

//   async _handleOffer(fromUserId, offer) {
//     try {
//       console.log(`Handling offer from user:`, fromUserId);

//       let pc = this.peerConnections.get(fromUserId);
//       if (!pc) {
//         pc = this._createPeerConnection(fromUserId);
//       }

//       if (pc.signalingState !== "stable") {
//         console.log(
//           `Current signaling state: ${pc.signalingState}, waiting for stability`,
//         );
//         await new Promise((resolve) => {
//           const checkState = () => {
//             if (pc.signalingState === "stable") {
//               resolve();
//             } else {
//               setTimeout(checkState, 100);
//             }
//           };
//           checkState();
//         });
//       }

//       await pc.setRemoteDescription(new RTCSessionDescription(offer));
//       console.log(`✅ Remote description set for ${fromUserId}`);

//       const pendingCandidates = this.pendingIceCandidates.get(fromUserId) || [];
//       pendingCandidates.forEach((candidate) => {
//         pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) =>
//           console.error("Error adding pending ICE candidate:", err),
//         );
//       });
//       this.pendingIceCandidates.delete(fromUserId);

//       const answer = await pc.createAnswer({
//         offerToReceiveAudio: true,
//         offerToReceiveVideo: this.currentCallType === "video",
//         voiceActivityDetection: true,
//       });

//       await pc.setLocalDescription(answer);

//       console.log(`📞 Sending answer to user:`, fromUserId);
//       this.socket.emit("answer", {
//         to: fromUserId,
//         answer: pc.localDescription,
//       });
//     } catch (error) {
//       console.error("Error handling offer:", error);
//     }
//   }

//   _cleanupPeerConnection(userId) {
//     const pc = this.peerConnections.get(userId);
//     if (pc) {
//       pc.close();
//       this.peerConnections.delete(userId);
//     }
//     this.remoteStreams.delete(userId);
//     this.pendingIceCandidates.delete(userId);
//     this.connectionInProgress.delete(userId);

//     this.socketIdToUserId.forEach((value, key) => {
//       if (value === userId) {
//         this.socketIdToUserId.delete(key);
//       }
//     });
//   }

//   _cleanupAllPeerConnections() {
//     this.peerConnections.forEach((pc) => pc.close());
//     this.peerConnections.clear();
//     this.remoteStreams.clear();
//     this.pendingIceCandidates.clear();
//     this.connectionInProgress.clear();
//   }

//   _handleStateChange(state, data) {
//     this.onConnectionStateChange?.({ state, data });
//   }

//   toggleAudio(enabled) {
//     if (this.localStream) {
//       this.localStream.getAudioTracks().forEach((track) => {
//         track.enabled = enabled;
//       });
//       console.log(`🔊 Audio ${enabled ? "enabled" : "disabled"}`);
//     }
//   }

//   toggleVideo(enabled) {
//     if (this.localStream) {
//       this.localStream.getVideoTracks().forEach((track) => {
//         track.enabled = enabled;
//       });
//       console.log(`📹 Video ${enabled ? "enabled" : "disabled"}`);
//     }
//   }

//   async startScreenShare() {
//     try {
//       if (!navigator.mediaDevices?.getDisplayMedia) {
//         throw new Error("Screen sharing not supported");
//       }

//       const screenStream = await navigator.mediaDevices.getDisplayMedia({
//         video: {
//           cursor: "always",
//           displaySurface: "monitor",
//         },
//         audio: false,
//       });

//       const screenTrack = screenStream.getVideoTracks()[0];

//       this.peerConnections.forEach((pc, userId) => {
//         const sender = pc.getSenders().find((s) => s.track?.kind === "video");
//         if (sender) {
//           sender.replaceTrack(screenTrack);
//         }
//       });

//       screenTrack.onended = () => {
//         this.stopScreenShare();
//       };

//       this.socket?.emit("screen-share-started", { roomId: this.currentRoom });

//       return screenStream;
//     } catch (error) {
//       console.error("Error starting screen share:", error);
//       throw error;
//     }
//   }

//   async stopScreenShare() {
//     if (this.localStream) {
//       const videoTrack = this.localStream.getVideoTracks()[0];

//       this.peerConnections.forEach((pc) => {
//         const sender = pc.getSenders().find((s) => s.track?.kind === "video");
//         if (sender) {
//           sender.replaceTrack(videoTrack);
//         }
//       });
//     }

//     this.socket?.emit("screen-share-stopped", { roomId: this.currentRoom });
//   }

//   leaveRoom() {
//     if (this.socket && this.currentRoom) {
//       this.socket.emit("leave-room", this.currentRoom);
//     }

//     this._cleanupAllPeerConnections();
//     this.pendingCalls.clear();
//     this.pendingCallData = null;

//     if (this.localStream) {
//       this.localStream.getTracks().forEach((track) => track.stop());
//       this.localStream = null;
//     }

//     this.currentRoom = null;
//     this.currentCallType = null;
//   }

//   disconnect() {
//     this.leaveRoom();

//     if (this.socket) {
//       this.socket.removeAllListeners();
//       this.socket.disconnect();
//       this.socket = null;
//     }

//     this.socketIdToUserId.clear();
//     this.pendingCalls.clear();
//     this.pendingCallData = null;
//     this.availableStaff = [];
//     this.directMessages = [];
//     this.messageHistory.clear();
//     this.pendingIceCandidates.clear();
//     this.connectionInProgress.clear();
//   }

//   isConnected() {
//     return this.socket?.connected || false;
//   }

//   getAvailableStaff() {
//     return this.availableStaff;
//   }

//   getDirectMessages() {
//     return this.directMessages;
//   }

//   getMessageHistory(key) {
//     return this.messageHistory.get(key) || [];
//   }

//   clearMessages(key) {
//     if (key) {
//       this.messageHistory.delete(key);
//       if (key === this.currentRoom) {
//         this.directMessages = this.directMessages.filter(
//           (m) => m.roomId !== key,
//         );
//       } else {
//         this.directMessages = this.directMessages.filter((m) => {
//           const conversationId = [m.sender?.userId, m.recipient?.userId]
//             .sort()
//             .join("-");
//           return conversationId !== key;
//         });
//       }
//     } else {
//       this.messageHistory.clear();
//       this.directMessages = [];
//     }
//   }

//   hasPendingCall() {
//     return this.pendingCallData !== null;
//   }

//   getPendingCall() {
//     return this.pendingCallData;
//   }
// }

// const webRTCService = new WebRTCService();
// export default webRTCService;





/* eslint-disable no-dupe-class-members */
/* eslint-disable no-undef */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */

// utils/webrtc.js
import { io } from "socket.io-client";

class WebRTCService {
  constructor() {
    // Core properties
    this.socket = null;
    this.peerConnections = new Map();
    this.socketIdToUserId = new Map();
    this.userIdToSocketId = new Map(); // Add reverse mapping
    this.localStream = null;
    this.remoteStreams = new Map();
    this.currentRoom = null;
    this.currentUser = null;
    this.currentCallType = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.availableStaff = [];
    this.directMessages = [];
    this.pendingCalls = new Map();
    this.messageHistory = new Map();
    this.pendingCallData = null;
    this.pendingIceCandidates = new Map(); // Keyed by socketId
    this.pendingIceCandidatesByUserId = new Map(); // Keyed by userId
    this.connectionInProgress = new Set();
    this.serverUrl = null;
    this.productionUrl = "https://library-server-5rpq.onrender.com";
    this.videoTrackEnabled = true;

    // Callbacks
    this.onUserJoined = null;
    this.onUserLeft = null;
    this.onMessageReceived = null;
    this.onDirectMessageReceived = null;
    this.onRemoteStream = null;
    this.onConnectionStateChange = null;
    this.onAudioLevelChange = null;
    this.onStaffListUpdate = null;
    this.onCallRejected = null;
    this.onIncomingCall = null;

    // Configuration
    this.config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun.services.mozilla.com" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:5349",
          username: "openrelayproject",
          credential: "openrelayproject",
        }
      ],
      iceCandidatePoolSize: 10,
    };
  }

  // Helper method to get the correct server URL
  getServerUrl() {
    if (this.serverUrl) return this.serverUrl;

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      console.log("Current hostname:", hostname);

      if (hostname.includes("render.com") || !hostname.includes("localhost")) {
        this.serverUrl = this.productionUrl;
        console.log("Using production server URL:", this.serverUrl);
        return this.serverUrl;
      }
    }

    if (typeof process !== "undefined" && process.env) {
      if (process.env.REACT_APP_SERVER_URL) {
        this.serverUrl = process.env.REACT_APP_SERVER_URL;
        console.log("Using server URL from env:", this.serverUrl);
        return this.serverUrl;
      }
    }

    this.serverUrl = "http://localhost:5000";
    console.log("Using local server URL:", this.serverUrl);
    return this.serverUrl;
  }

  // Health check method
  async checkServerHealth() {
    try {
      const baseUrl = this.getServerUrl();
      const endpoints = [
        `${baseUrl}/health`,
        `${baseUrl}/api/health`,
        `${baseUrl}`,
        `${baseUrl}/socket.io/socket.io.js`,
      ];

      for (const url of endpoints) {
        try {
          console.log("Checking server health at:", url);
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
            cache: "no-cache",
            signal: AbortSignal.timeout(5000),
          });

          if (response.ok) {
            console.log("Server health check passed at:", url);
            return true;
          }
        } catch (e) {
          console.log(`Health check failed for ${url}:`, e.message);
        }
      }

      try {
        const response = await fetch(baseUrl, {
          method: "GET",
          mode: "cors",
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          console.log("Base URL health check passed");
          return true;
        }
      } catch (e) {
        console.log("Base URL health check failed:", e.message);
      }

      console.log("All health checks failed");
      return false;
    } catch (error) {
      console.error("Server health check failed:", error.message);
      return false;
    }
  }

  initialize(userId, username, role) {
    if (this.socket?.connected) {
      if (this.pendingCallData && this.onIncomingCall) {
        this.onIncomingCall(this.pendingCallData);
      }
      return this.socket;
    }

    console.log("Initializing WebRTC with:", { userId, username, role });

    const serverUrl = this.getServerUrl();
    console.log("Connecting to Socket.IO server:", serverUrl);

    this.socket = io(serverUrl, {
      query: { userId, username, role },
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 30000,
      withCredentials: true,
      forceNew: true,
      rememberUpgrade: true,
      upgrade: true,
      rejectUnauthorized: false,
      autoConnect: true,
      randomizationFactor: 0.5,
    });

    this.currentUser = { userId, username, role };
    this._setupListeners();

    setTimeout(() => {
      this.checkServerHealth().then((isHealthy) => {
        console.log("Initial health check result:", isHealthy);
        if (!isHealthy && this.onConnectionStateChange) {
          this.onConnectionStateChange({
            state: "warning",
            data: "Server health check failed, but attempting connection...",
          });
        }
      });
    }, 1000);

    return this.socket;
  }

  _processPendingCandidatesForSocket(socketId, userId) {
    // Process candidates queued by socketId
    const pendingBySocket = this.pendingIceCandidates.get(socketId);
    if (pendingBySocket && pendingBySocket.length > 0) {
      console.log(`Processing ${pendingBySocket.length} pending candidates for socket ${socketId} -> user ${userId}`);
      pendingBySocket.forEach(candidate => {
        this._handleIceCandidate(userId, candidate);
      });
      this.pendingIceCandidates.delete(socketId);
    }
  }

  _processPendingCandidatesForUser(userId) {
    // Process candidates queued by userId
    const pendingByUser = this.pendingIceCandidatesByUserId.get(userId);
    if (pendingByUser && pendingByUser.length > 0) {
      console.log(`Processing ${pendingByUser.length} pending candidates for user ${userId}`);
      pendingByUser.forEach(candidate => {
        this._handleIceCandidate(userId, candidate);
      });
      this.pendingIceCandidatesByUserId.delete(userId);
    }
  }

  _setupListeners() {
    this.socket.on("connect", () => {
      console.log(
        "✅ Connected to server with transport:",
        this.socket.io.engine.transport.name,
      );
      this._handleStateChange("connected");
      this.reconnectAttempts = 0;

      if (this.socket && this.currentUser) {
        this.socketIdToUserId.set(this.socket.id, this.currentUser.userId);
        this.userIdToSocketId.set(this.currentUser.userId, this.socket.id);
      }

      this.socket.emit("request-staff-list");
      this.socket.emit("request-message-history", this.currentUser.userId);

      if (this.socket.io.engine.transport.name === "polling") {
        console.log(
          "Currently using polling, attempting to upgrade to websocket...",
        );
        setTimeout(() => {
          if (this.socket && this.socket.io) {
            this.socket.io.opts.transports = ["polling", "websocket"];
          }
        }, 2000);
      }

      if (this.pendingCallData && this.onIncomingCall) {
        this.onIncomingCall(this.pendingCallData);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
      this._handleStateChange("disconnected", reason);
      this.socketIdToUserId.clear();
      this.userIdToSocketId.clear();
      this._cleanupAllPeerConnections();

      if (reason === "io server disconnect" || reason === "transport close") {
        console.log("Server disconnected, attempting to reconnect...");
        setTimeout(() => {
          if (this.socket && !this.socket.connected) {
            this.socket.connect();
          }
        }, 1000);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔴 Connection error:", error);
      this._handleStateChange("error", error.message);

      console.log("Connection error details:", {
        message: error.message,
        type: error.type,
        description: error.description,
      });

      if (this.socket && this.socket.io) {
        console.log("Switching to polling only transport...");
        this.socket.io.opts.transports = ["polling"];
      }
    });

    this.socket.on("reconnect_attempt", (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}`);
      this._handleStateChange("reconnecting", `Attempt ${attempt}`);
    });

    this.socket.on("reconnect", () => {
      console.log("✅ Reconnected to server");
      this._handleStateChange("reconnected");

      if (this.currentUser) {
        this.socket.emit("request-staff-list");
        this.socket.emit("request-message-history", this.currentUser.userId);
      }
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
      this._handleStateChange("reconnect_error", error.message);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("Reconnection failed after all attempts");
      this._handleStateChange(
        "reconnect_failed",
        "Could not reconnect to server",
      );
    });

    this.socket.on("ping", () => {
      console.log("🏓 Ping received");
    });

    this.socket.on("pong", (latency) => {
      console.log("🏓 Pong received, latency:", latency, "ms");
    });

    this.socket.on("staff-list", (staffList) => {
      console.log("📋 Available staff:", staffList);
      this.availableStaff = Array.isArray(staffList) ? staffList : [];
      this.onStaffListUpdate?.(this.availableStaff);
    });

    this.socket.on("staff-available", (staff) => {
      console.log("🟢 Staff available:", staff.username);
      this.availableStaff = [...this.availableStaff, staff];
      this.onStaffListUpdate?.(this.availableStaff);
    });

    this.socket.on("staff-unavailable", (data) => {
      const staffId = typeof data === "string" ? data : data.userId;
      console.log("🔴 Staff unavailable:", staffId);
      this.availableStaff = this.availableStaff.filter(
        (s) => s.userId !== staffId,
      );
      this.onStaffListUpdate?.(this.availableStaff);
    });

    this.socket.on("message-history", (data) => {
      console.log("📜 Received message history");
      const history = Array.isArray(data) ? data : data?.roomHistories || [];
      history.forEach((msg) => {
        const key = msg.roomId || msg.conversationId || "direct";
        if (!this.messageHistory.has(key)) {
          this.messageHistory.set(key, []);
        }
        this.messageHistory.get(key).push(msg);
      });
    });

    this.socket.on("direct-message", (message) => {
      console.log("💬 Direct message received:", message);
      this.directMessages.push(message);

      if (message.sender && this.currentUser) {
        const conversationId = [this.currentUser.userId, message.sender.userId]
          .sort()
          .join("-");
        if (!this.messageHistory.has(conversationId)) {
          this.messageHistory.set(conversationId, []);
        }
        this.messageHistory.get(conversationId).push(message);
      }

      this.onDirectMessageReceived?.(message);
    });

    this.socket.on("user-joined", async (data) => {
      console.log("👥 User joined:", data.username);
      
      // Store both mappings
      this.socketIdToUserId.set(data.socketId, data.userId);
      this.userIdToSocketId.set(data.userId, data.socketId);
      
      // Process any pending candidates for this socket
      this._processPendingCandidatesForSocket(data.socketId, data.userId);

      if (data.userId !== this.currentUser?.userId) {
        if (this.currentUser?.userId < data.userId) {
          console.log("Creating offer because userId is smaller");
          setTimeout(() => this._createOffer(data.userId), 1000);
        } else {
          console.log("Waiting for offer from other user");
        }
      }
      this.onUserJoined?.(data);
    });

    this.socket.on("user-left", (data) => {
      console.log("👋 User left:", data.username);
      
      // Get userId before cleanup
      const userId = this.socketIdToUserId.get(data.socketId) || data.userId;
      
      this.socketIdToUserId.delete(data.socketId);
      this.userIdToSocketId.delete(userId);
      this._cleanupPeerConnection(userId);
      this.connectionInProgress.delete(userId);
      this.onUserLeft?.(data);
    });

    this.socket.on("call-initiated", ({ from, roomId, callType }) => {
      console.log(`📞 Incoming ${callType} call from:`, from);
      const callData = { from, roomId, callType };
      this.pendingCallData = callData;
      this.pendingCalls.set(from.userId, callData);

      if (this.onIncomingCall) {
        this.onIncomingCall(callData);
      }
    });

    this.socket.on("call-rejected", ({ from, callType }) => {
      console.log(`❌ Call rejected by:`, from);
      this.pendingCalls.delete(from.userId);
      if (this.pendingCallData?.from.userId === from.userId) {
        this.pendingCallData = null;
      }
      this.onCallRejected?.(from, callType);
    });

    this.socket.on("call-accepted", ({ from, roomId, callType }) => {
      console.log(`✅ Call accepted by:`, from);
      if (this.currentRoom !== roomId) {
        this.currentRoom = roomId;
        this.currentCallType = callType;
        this.socket.emit("join-room", { roomId, callType });
      }
    });

    this.socket.on("room-joined", (data) => {
      console.log("🚪 Joined room:", data.roomId);
      this._handleStateChange("room_joined", data.roomId);

      this.pendingCalls.clear();
      this.pendingCallData = null;

      if (data.chatHistory) {
        const history = Array.isArray(data.chatHistory) ? data.chatHistory : [];
        this.messageHistory.set(data.roomId, history);
        history.forEach((msg) => {
          this.onMessageReceived?.(msg);
        });
      }

      if (data.participants) {
        const participants = Array.isArray(data.participants)
          ? data.participants
          : [];
        participants.forEach((p) => {
          const targetUserId = p.userId;
          if (targetUserId && targetUserId !== this.currentUser?.userId) {
            if (this.currentUser?.userId < targetUserId) {
              setTimeout(() => this._createOffer(targetUserId), 1500);
            }
          }
        });
      }
    });

    this.socket.on(
      "offer",
      async ({ from, fromUserId, fromUsername, offer }) => {
        console.log("📞 Received offer from:", fromUsername);
        
        // Store the mapping
        this.socketIdToUserId.set(from, fromUserId);
        this.userIdToSocketId.set(fromUserId, from);
        
        // Process any pending candidates for this user
        this._processPendingCandidatesForUser(fromUserId);

        if (this.connectionInProgress.has(fromUserId)) {
          console.log("Connection already in progress for:", fromUserId);
          return;
        }

        this.connectionInProgress.add(fromUserId);

        try {
          await this._handleOffer(fromUserId, offer);
        } catch (error) {
          console.error("Error handling offer:", error);
          this.connectionInProgress.delete(fromUserId);
        }
      },
    );

    this.socket.on("answer", ({ from, fromUserId, fromUsername, answer }) => {
      console.log("📞 Received answer from:", fromUsername);
      
      // Determine the userId
      let targetUserId = fromUserId;
      
      if (!targetUserId) {
        targetUserId = this.socketIdToUserId.get(from);
      }
      
      if (!targetUserId) {
        console.error("Could not determine userId for answer from:", from);
        return;
      }
      
      // Store the mapping if we got it from socketId
      if (fromUserId && fromUserId !== targetUserId) {
        this.socketIdToUserId.set(from, fromUserId);
        this.userIdToSocketId.set(fromUserId, from);
      }
      
      this._handleAnswer(targetUserId, answer);
    });

    this.socket.on("ice-candidate", ({ from, fromUserId, fromUsername, candidate }) => {
      console.log("❄️ Received ICE candidate from:", fromUsername);
      
      let targetUserId = fromUserId;
      
      if (!targetUserId) {
        targetUserId = this.socketIdToUserId.get(from);
      }
      
      if (!targetUserId) {
        console.log(`Could not determine userId for ICE candidate from ${from}, storing by socketId`);
        // Store by socketId temporarily
        if (!this.pendingIceCandidates.has(from)) {
          this.pendingIceCandidates.set(from, []);
        }
        this.pendingIceCandidates.get(from).push(candidate);
        return;
      }
      
      // Store the mapping
      if (fromUserId && fromUserId !== targetUserId) {
        this.socketIdToUserId.set(from, fromUserId);
        this.userIdToSocketId.set(fromUserId, from);
      }
      
      this._handleIceCandidate(targetUserId, candidate);
    });

    this.socket.on("receive-message", (message) => {
      console.log("💬 Room message received:", message);
      if (message.roomId) {
        if (!this.messageHistory.has(message.roomId)) {
          this.messageHistory.set(message.roomId, []);
        }
        this.messageHistory.get(message.roomId).push(message);
      }
      this.onMessageReceived?.(message);
    });

    this.socket.on("message-reaction", ({ messageId, reaction, userId }) => {
      console.log("👍 Message reaction:", { messageId, reaction, userId });
      this.messageHistory.forEach((messages) => {
        const msg = messages.find((m) => m.id === messageId);
        if (msg) {
          if (!msg.reactions) msg.reactions = {};
          if (!msg.reactions[reaction]) msg.reactions[reaction] = [];
          if (!msg.reactions[reaction].includes(userId)) {
            msg.reactions[reaction].push(userId);
          }
        }
      });
    });

    this.socket.on("message-deleted", ({ messageId }) => {
      console.log("🗑️ Message deleted:", messageId);
      this.messageHistory.forEach((messages, key) => {
        const index = messages.findIndex((m) => m.id === messageId);
        if (index !== -1) {
          messages.splice(index, 1);
        }
      });
    });
  }

  _handleAnswer(userId, answer) {
    const pc = this.peerConnections.get(userId);
    if (!pc) {
      console.log(`No peer connection for ${userId}, cannot set answer`);
      return;
    }

    if (pc.signalingState === "have-local-offer") {
      pc.setRemoteDescription(new RTCSessionDescription(answer))
        .then(() => {
          console.log(`✅ Remote description set for ${userId}`);

          // Process any pending ICE candidates for this user
          const pendingCandidates = this.pendingIceCandidatesByUserId.get(userId) || [];
          if (pendingCandidates.length > 0) {
            console.log(`Processing ${pendingCandidates.length} pending ICE candidates for ${userId}`);
            pendingCandidates.forEach((candidate) => {
              pc.addIceCandidate(new RTCIceCandidate(candidate))
                .then(() => console.log(`✅ Added pending ICE candidate for ${userId}`))
                .catch(err => console.error("Error adding pending ICE candidate:", err));
            });
            this.pendingIceCandidatesByUserId.delete(userId);
          }

          this.connectionInProgress.delete(userId);
        })
        .catch((err) => {
          console.error("Error setting remote description:", err);
          this.connectionInProgress.delete(userId);
        });
    } else {
      console.log(
        `Cannot set answer, current signaling state: ${pc.signalingState}`,
      );
      this.connectionInProgress.delete(userId);
    }
  }

  _handleIceCandidate(userId, candidate) {
    const pc = this.peerConnections.get(userId);

    if (!pc) {
      console.log(`No peer connection for ${userId}, queuing ICE candidate`);
      if (!this.pendingIceCandidatesByUserId.has(userId)) {
        this.pendingIceCandidatesByUserId.set(userId, []);
      }
      this.pendingIceCandidatesByUserId.get(userId).push(candidate);
      return;
    }

    // Check if remote description is set
    if (pc.remoteDescription && pc.remoteDescription.type) {
      pc.addIceCandidate(new RTCIceCandidate(candidate))
        .then(() => console.log(`✅ ICE candidate added for ${userId}`))
        .catch(err => console.error("Error adding ICE candidate:", err));
    } else {
      console.log(
        `Remote description not set yet for ${userId}, queuing ICE candidate`,
      );
      if (!this.pendingIceCandidatesByUserId.has(userId)) {
        this.pendingIceCandidatesByUserId.set(userId, []);
      }
      this.pendingIceCandidatesByUserId.get(userId).push(candidate);
    }
  }

  sendDirectMessage(targetUserId, text, messageType = "text", mediaUrl = null) {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected");
    }

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      type: messageType,
      mediaUrl,
      sender: this.currentUser,
      timestamp: new Date().toISOString(),
      private: true,
      reactions: {},
      read: false,
    };

    this.socket.emit("direct-message", {
      to: targetUserId,
      message,
    });

    if (this.currentUser) {
      const conversationId = [this.currentUser.userId, targetUserId]
        .sort()
        .join("-");
      if (!this.messageHistory.has(conversationId)) {
        this.messageHistory.set(conversationId, []);
      }
      this.messageHistory.get(conversationId).push(message);
    }

    return message;
  }

  sendMessage(text, messageType = "text", mediaUrl = null) {
    if (!this.currentRoom) return null;

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      type: messageType,
      mediaUrl,
      roomId: this.currentRoom,
      sender: this.currentUser,
      timestamp: new Date().toISOString(),
      reactions: {},
    };

    this.socket.emit("send-message", message);

    if (!this.messageHistory.has(this.currentRoom)) {
      this.messageHistory.set(this.currentRoom, []);
    }
    this.messageHistory.get(this.currentRoom).push(message);

    return message;
  }

  addReaction(messageId, reaction) {
    if (!this.socket?.connected) return;
    this.socket.emit("message-reaction", {
      messageId,
      reaction,
      userId: this.currentUser?.userId,
    });
  }

  deleteMessage(messageId) {
    if (!this.socket?.connected) return;
    this.socket.emit("delete-message", {
      messageId,
      userId: this.currentUser?.userId,
    });
  }

  async startCall(targetUserId, callType = "video") {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected");
    }

    this._cleanupPeerConnection(targetUserId);
    this.currentCallType = callType;

    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Call initiation timeout"));
      }, 30000);

      try {
        console.log(`📹 Setting up local stream for ${callType} call...`);

        // IMPORTANT: For video calls, make sure we request video
        await this._setupLocalStream(callType === "video", true);

        console.log("✅ Local stream setup complete");
        console.log("Local stream details:", {
          videoTracks: this.localStream?.getVideoTracks().length || 0,
          audioTracks: this.localStream?.getAudioTracks().length || 0,
        });

        // Verify video track is present for video calls
        if (callType === "video") {
          const videoTrack = this.localStream?.getVideoTracks()[0];
          if (!videoTrack) {
            throw new Error("No video track available for video call");
          }
          console.log("Video track available:", {
            enabled: videoTrack.enabled,
            readyState: videoTrack.readyState,
            settings: videoTrack.getSettings(),
          });
        }

        const roomId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        console.log(`📞 Initiating call to ${targetUserId}`);
        this.socket.emit("initiate-call", {
          targetUserId,
          roomId,
          callType,
        });

        console.log(`🚪 Joining room: ${roomId}`);
        this.socket.emit("join-room", {
          roomId,
          callType,
        });

        this.socket.once("room-joined", (data) => {
          clearTimeout(timeout);
          console.log("Call started successfully:", data);
          this.currentRoom = roomId;
          resolve(data);
        });
      } catch (error) {
        clearTimeout(timeout);
        console.error("❌ Error starting call:", error);
        reject(error);
      }
    });
  }

  rejectCall(fromUserId, callType) {
    if (!this.socket?.connected) return;
    this.socket.emit("reject-call", {
      from: fromUserId,
      callType,
    });
    this.pendingCalls.delete(fromUserId);
    if (this.pendingCallData?.from.userId === fromUserId) {
      this.pendingCallData = null;
    }
  }

  async acceptCall(roomId, callType) {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected");
    }

    this.currentCallType = callType;
    this.currentRoom = roomId;

    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Call acceptance timeout"));
      }, 30000);

      try {
        console.log(`📹 Setting up local stream for ${callType} call...`);
        await this._setupLocalStream(callType === "video", true);
        console.log("✅ Local stream setup complete");

        const callerUserId = Array.from(this.pendingCalls.keys())[0];
        if (callerUserId) {
          this.socket.emit("accept-call", {
            from: callerUserId,
            roomId,
            callType,
          });
        }

        this.socket.emit("join-room", {
          roomId,
          callType,
        });

        this.socket.once("room-joined", (data) => {
          clearTimeout(timeout);
          console.log("Call joined successfully:", data);
          this.pendingCallData = null;
          resolve(data);
        });
      } catch (error) {
        clearTimeout(timeout);
        console.error("❌ Error accepting call:", error);
        reject(error);
      }
    });
  }

  async _setupLocalStream(video = true, audio = true) {
    if (this.localStream) {
      const hasVideo = this.localStream.getVideoTracks().length > 0;
      const hasAudio = this.localStream.getAudioTracks().length > 0;

      if (
        (video && !hasVideo) ||
        (!video && hasVideo) ||
        (audio && !hasAudio) ||
        (!audio && hasAudio)
      ) {
        console.log("Recreating stream for different media type");
        this.localStream.getTracks().forEach((track) => track.stop());
        this.localStream = null;
      } else {
        console.log("Using existing stream");
        return this.localStream;
      }
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser doesn't support video/audio");
      }

      console.log(
        `Requesting ${video ? "camera and " : ""}microphone access...`,
      );

      // Enhanced video constraints for better compatibility
      const constraints = {
        video: video
          ? {
              width: { ideal: 1280, min: 640 },
              height: { ideal: 720, min: 480 },
              facingMode: "user",
              frameRate: { ideal: 30, min: 15 },
              aspectRatio: { ideal: 16 / 9 },
              resizeMode: "crop-and-scale",
            }
          : false,
        audio: audio
          ? {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              sampleRate: { ideal: 48000 },
              channelCount: { ideal: 2 },
            }
          : false,
      };

      console.log("Using constraints:", constraints);

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);

      console.log("✅ Media access granted!");
      console.log("Video tracks:", this.localStream.getVideoTracks().length);
      console.log("Audio tracks:", this.localStream.getAudioTracks().length);

      // Enable all tracks explicitly
      this.localStream.getTracks().forEach((track) => {
        track.enabled = true;
        console.log(`Track ${track.kind} enabled:`, track.enabled);
      });

      this._setupAudioMonitoring();

      return this.localStream;
    } catch (error) {
      console.error("❌ Media setup error:", error);

      let errorMessage = "Failed to access camera/microphone";
      if (error.name === "NotAllowedError") {
        errorMessage =
          "Camera/Microphone access denied. Please allow permissions.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera or microphone found on this device.";
      } else if (error.name === "NotReadableError") {
        errorMessage = "Camera/Microphone is in use by another application.";
      } else if (error.name === "OverconstrainedError") {
        errorMessage = "Camera doesn't support required settings.";
      } else if (error.name === "TypeError") {
        errorMessage = "Invalid media constraints. Please check your device.";
      }

      throw new Error(errorMessage);
    }
  }

  _setupAudioMonitoring() {
    if (!this.localStream || !window.AudioContext) return;

    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;

      const source = audioContext.createMediaStreamSource(this.localStream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkAudioLevel = () => {
        if (!this.localStream || !this.socket?.connected) return;

        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const normalizedLevel = average / 255;

        this.onAudioLevelChange?.(normalizedLevel);

        requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    } catch (error) {
      console.error("Error setting up audio monitoring:", error);
    }
  }

  _createPeerConnection(userId) {
    if (this.peerConnections.has(userId)) {
      this._cleanupPeerConnection(userId);
    }

    console.log(`Creating peer connection for ${userId}`);

    const pc = new RTCPeerConnection({
      iceServers: this.config.iceServers,
      iceCandidatePoolSize: this.config.iceCandidatePoolSize,
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
      iceTransportPolicy: "all",
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        console.log(`Adding ${track.kind} track to peer connection for ${userId}`);
        pc.addTrack(track, this.localStream);
      });
    } else {
      console.warn(`No local stream available for ${userId}, adding receive-only transceivers`);
      // Add transceivers to receive media even without sending
      pc.addTransceiver('audio', { direction: 'recvonly' });
      if (this.currentCallType === 'video') {
        pc.addTransceiver('video', { direction: 'recvonly' });
      }
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(`❄️ Sending ICE candidate for ${userId}`);
        this.socket.emit("ice-candidate", {
          to: userId,  // Send to userId, not socketId
          candidate: event.candidate,
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`❄️ ICE state with ${userId}:`, pc.iceConnectionState);

      switch(pc.iceConnectionState) {
        case "connected":
        case "completed":
          console.log(`✅ Connection established with ${userId}`);
          this.connectionInProgress.delete(userId);
          break;
          
        case "failed":
          console.log(`❌ Connection failed with ${userId}, attempting restart`);
          pc.restartIce();
          break;
          
        case "disconnected":
          console.log(`⚠️ Connection disconnected with ${userId}`);
          // Give it a chance to recover
          setTimeout(() => {
            if (pc.iceConnectionState === "disconnected") {
              console.log(`Still disconnected, attempting ICE restart for ${userId}`);
              pc.restartIce();
            }
          }, 5000);
          break;
          
        case "closed":
          console.log(`🔒 Connection closed with ${userId}`);
          this.connectionInProgress.delete(userId);
          break;
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`🔌 Connection state with ${userId}:`, pc.connectionState);
      if (pc.connectionState === "connected") {
        this.connectionInProgress.delete(userId);
      }
    };

    pc.ontrack = (event) => {
      console.log(`📡 Received ${event.track.kind} track from:`, userId);
      
      // Ensure audio track is enabled
      if (event.track.kind === 'audio') {
        event.track.enabled = true;
        console.log(`   Audio track enabled: ${event.track.enabled}, readyState: ${event.track.readyState}`);
      }

      const [stream] = event.streams;

      if (stream) {
        console.log("Remote stream details:", {
          id: stream.id,
          active: stream.active,
          videoTracks: stream.getVideoTracks().length,
          audioTracks: stream.getAudioTracks().length,
        });

        this.remoteStreams.set(userId, stream);
        this.onRemoteStream?.(userId, stream);
      }
    };

    pc.onnegotiationneeded = () => {
      console.log(`🔄 Negotiation needed for ${userId}`);
    };

    this.peerConnections.set(userId, pc);
    return pc;
  }

  async _createOffer(userId) {
    if (this.connectionInProgress.has(userId)) {
      console.log(
        `Connection already in progress for ${userId}, skipping offer creation`,
      );
      return;
    }

    this.connectionInProgress.add(userId);

    try {
      if (!this.localStream) {
        console.log(`No local stream, creating one before offer to ${userId}`);
        await this._setupLocalStream(this.currentCallType === "video", true);
      }

      let pc = this.peerConnections.get(userId);
      if (!pc) {
        pc = this._createPeerConnection(userId);
      }

      if (pc.signalingState !== "stable") {
        console.log(
          `Signaling state not stable for ${userId}, current state:`,
          pc.signalingState,
        );
        await new Promise((resolve) => {
          const checkState = () => {
            if (pc.signalingState === "stable") {
              resolve();
            } else {
              setTimeout(checkState, 100);
            }
          };
          checkState();
        });
      }

      console.log(`Creating offer for ${userId}`);
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.currentCallType === "video",
        iceRestart: true,
        voiceActivityDetection: true,
      });

      await pc.setLocalDescription(offer);

      console.log(`📞 Sending offer to user:`, userId);
      
      // Get the socket ID for this user
      const targetSocketId = this.userIdToSocketId.get(userId);
      
      this.socket.emit("offer", {
        to: targetSocketId || userId, // Prefer socketId if available
        toUserId: userId,
        offer: pc.localDescription,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
      this.connectionInProgress.delete(userId);
    }
  }

  async _handleOffer(fromUserId, offer) {
    try {
      console.log(`Handling offer from user:`, fromUserId);

      let pc = this.peerConnections.get(fromUserId);
      if (!pc) {
        pc = this._createPeerConnection(fromUserId);
      }

      if (pc.signalingState !== "stable") {
        console.log(
          `Current signaling state: ${pc.signalingState}, waiting for stability`,
        );
        await new Promise((resolve) => {
          const checkState = () => {
            if (pc.signalingState === "stable") {
              resolve();
            } else {
              setTimeout(checkState, 100);
            }
          };
          checkState();
        });
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      console.log(`✅ Remote description set for ${fromUserId}`);

      // Process any pending ICE candidates for this user
      const pendingCandidates = this.pendingIceCandidatesByUserId.get(fromUserId) || [];
      if (pendingCandidates.length > 0) {
        console.log(`Processing ${pendingCandidates.length} pending ICE candidates for ${fromUserId}`);
        for (const candidate of pendingCandidates) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
            console.log(`✅ Added pending ICE candidate for ${fromUserId}`);
          } catch (err) {
            console.error("Error adding pending ICE candidate:", err);
          }
        }
        this.pendingIceCandidatesByUserId.delete(fromUserId);
      }

      const answer = await pc.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.currentCallType === "video",
        voiceActivityDetection: true,
      });

      await pc.setLocalDescription(answer);

      console.log(`📞 Sending answer to user:`, fromUserId);
      
      // Get the socket ID for this user
      const targetSocketId = this.userIdToSocketId.get(fromUserId);
      
      this.socket.emit("answer", {
        to: targetSocketId || fromUserId, // Prefer socketId if available
        toUserId: fromUserId,
        answer: pc.localDescription,
      });
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  }

  _cleanupPeerConnection(userId) {
    const pc = this.peerConnections.get(userId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(userId);
    }
    this.remoteStreams.delete(userId);
    this.pendingIceCandidatesByUserId.delete(userId);
    this.connectionInProgress.delete(userId);

    // Clean up socket mappings
    this.socketIdToUserId.forEach((value, key) => {
      if (value === userId) {
        this.socketIdToUserId.delete(key);
      }
    });
    this.userIdToSocketId.delete(userId);
  }

  _cleanupAllPeerConnections() {
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.remoteStreams.clear();
    this.pendingIceCandidates.clear();
    this.pendingIceCandidatesByUserId.clear();
    this.connectionInProgress.clear();
  }

  _handleStateChange(state, data) {
    this.onConnectionStateChange?.({ state, data });
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
      console.log(`🔊 Audio ${enabled ? "enabled" : "disabled"}`);
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
      console.log(`📹 Video ${enabled ? "enabled" : "disabled"}`);
    }
  }

  async startScreenShare() {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error("Screen sharing not supported");
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          displaySurface: "monitor",
        },
        audio: false,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      this.peerConnections.forEach((pc, userId) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(screenTrack);
        }
      });

      screenTrack.onended = () => {
        this.stopScreenShare();
      };

      this.socket?.emit("screen-share-started", { roomId: this.currentRoom });

      return screenStream;
    } catch (error) {
      console.error("Error starting screen share:", error);
      throw error;
    }
  }

  async stopScreenShare() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];

      this.peerConnections.forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });
    }

    this.socket?.emit("screen-share-stopped", { roomId: this.currentRoom });
  }

  leaveRoom() {
    if (this.socket && this.currentRoom) {
      this.socket.emit("leave-room", this.currentRoom);
    }

    this._cleanupAllPeerConnections();
    this.pendingCalls.clear();
    this.pendingCallData = null;

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    this.currentRoom = null;
    this.currentCallType = null;
  }

  disconnect() {
    this.leaveRoom();

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.socketIdToUserId.clear();
    this.userIdToSocketId.clear();
    this.pendingCalls.clear();
    this.pendingCallData = null;
    this.availableStaff = [];
    this.directMessages = [];
    this.messageHistory.clear();
    this.pendingIceCandidates.clear();
    this.pendingIceCandidatesByUserId.clear();
    this.connectionInProgress.clear();
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  getAvailableStaff() {
    return this.availableStaff;
  }

  getDirectMessages() {
    return this.directMessages;
  }

  getMessageHistory(key) {
    return this.messageHistory.get(key) || [];
  }

  clearMessages(key) {
    if (key) {
      this.messageHistory.delete(key);
      if (key === this.currentRoom) {
        this.directMessages = this.directMessages.filter(
          (m) => m.roomId !== key,
        );
      } else {
        this.directMessages = this.directMessages.filter((m) => {
          const conversationId = [m.sender?.userId, m.recipient?.userId]
            .sort()
            .join("-");
          return conversationId !== key;
        });
      }
    } else {
      this.messageHistory.clear();
      this.directMessages = [];
    }
  }

  hasPendingCall() {
    return this.pendingCallData !== null;
  }

  getPendingCall() {
    return this.pendingCallData;
  }
}

const webRTCService = new WebRTCService();
export default webRTCService;