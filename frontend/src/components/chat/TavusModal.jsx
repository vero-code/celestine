import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import './css/TavusModal.css';

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect></svg>
);

const TavusModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [conversationUrl, setConversationUrl] = useState(null);
    const [replicaThumbnail, setReplicaThumbnail] = useState(null);

    const setActiveChatMode = useAppStore((state) => state.setActiveChatMode);
    const setActiveConversationId = useAppStore((state) => state.setActiveConversationId);
    const endActiveConversation = useAppStore((state) => state.endActiveConversation);
    const BACKEND_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchReplicaThumbnail = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/tavus-replica-thumbnail`);
                if (!response.ok) throw new Error('Failed to fetch thumbnail');
                const data = await response.json();
                setReplicaThumbnail(data.thumbnail_url);
            } catch (err) {
                console.error('Failed to load replica thumbnail:', err);
            }
        };
        fetchReplicaThumbnail();
    }, [BACKEND_URL]);

    const startConversation = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/create-tavus-conversation`, { method: 'POST' });
            if (!response.ok) throw new Error('Failed to start conversation');

            const data = await response.json();
            if (!data.conversation_url) throw new Error('No conversation URL returned');
            setConversationUrl(data.conversation_url);
            setActiveConversationId(data.conversation_id);
        } catch (err) {
            console.error('Failed to start conversation:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        endActiveConversation();
        setActiveChatMode('text');
    };

    return (
        <div className="tavus-modal-backdrop" onClick={handleClose}>
            <div className="tavus-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="tavus-modal-close-button" onClick={handleClose}>&times;</button>

                <div className="tavus-container">
                  {!conversationUrl && !isLoading && (
                    <div className="tavus-start-screen">
                        <div className="tavus-avatar-container">
                            {replicaThumbnail ? (
                                <video
                                    src={replicaThumbnail}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="tavus-avatar-video"
                                />
                            ) : (
                                <div className="tavus-avatar-placeholder" />
                            )}
                        </div>
                        <h3>Ready for a video chat?</h3>
                        <p>Start a real-time conversation with your AI companion.</p>
                        <button onClick={startConversation} className="tavus-start-button">
                            <VideoIcon />
                            <span>Talk to AI Agent</span>
                        </button>
                    </div>
                  )}

                  {isLoading && (
                      <div className="tavus-loading-screen">
                          <div className="tavus-spinner" />
                          <p>Creating conversation...</p>
                      </div>
                  )}

                  {conversationUrl && (
                      <iframe
                          key={conversationUrl}
                          src={conversationUrl}
                          allow="camera; microphone; fullscreen; display-capture; autoplay"
                          className="tavus-iframe"
                          title="Tavus AI Conversation"
                      />
                  )}
                </div>
            </div>
        </div>
    );
};

export default TavusModal;
