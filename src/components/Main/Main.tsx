import { createSignal } from 'solid-js';
import './main.css';
import Sidebar from '../Sidebar/Sidebar';

const API_KEY = 'AIzaSyDpZ6TVp0upQQ130Ziq7lRsQKd9ajJ5Pz8';

interface Message {
    content: string;
    isUser: boolean;
    timestamp: Date;
}

interface Model {
    id: string;
    name: string;
}

const models: Model[] = [
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
    { id: 'custom', name: 'Custom Model' },
];

// Konfigurasi generationConfig untuk kontrol kualitas jawaban
const generationConfig = {
    temperature: 0.2,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const Main = () => {
    const [messages, setMessages] = createSignal<Message[]>([]);
    const [input, setInput] = createSignal('');
    const [isLoading, setIsLoading] = createSignal(false);
    const [selectedModel, setSelectedModel] = createSignal<Model>(models[0]);
    const [customModelId, setCustomModelId] = createSignal('');
    const [customPrompt, setCustomPrompt] = createSignal('');

    const sendMessage = async () => {
        if (input().trim() === '') return;
    
        const userMessage: Message = {
            content: input(),
            isUser: true,
            timestamp: new Date(),
        };
    
        setMessages([...messages(), userMessage]);
        setInput('');
        setIsLoading(true);
    
        try {
            const modelId = selectedModel().id === 'custom' ? customModelId() : selectedModel().id;
            const promptedMessage = customPrompt()
                ? `${customPrompt()}\n\nUser: ${userMessage.content}`
                : userMessage.content;
    
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptedMessage }] }],
                        generationConfig,
                    }),
                }
            );
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            const botReply = data.candidates[0].content.parts[0].text;
    
            // Format respons menjadi HTML yang lebih rapi
            const formattedReply = botReply.split('\n').map((line: any) => {
                // Jika ada bullet points atau daftar, format sebagai list
                if (line.startsWith('-')) {
                    return `<li>${line.slice(1).trim()}</li>`;
                }
                return `<p>${line}</p>`;
            }).join('');
    
            const botMessage: Message = {
                content: formattedReply,
                isUser: false,
                timestamp: new Date(),
            };
    
            setMessages([...messages(), botMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                content: `Error: ${error.message}. Please try again.`,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages([...messages(), errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };    


    return (
        <>
            <Sidebar />
            <div class='main'>
                <div class='nav'>
                    <button class='versiAI'>
                        <p class='judulAI'>InspoAI</p>
                        <img src="src/assets/arrowDown.svg" alt="Arrow Down" class='arrowDown' />
                    </button>
                    <button class='buttonUpgrade'>
                        <img src="src/assets/inspoLogo.svg" alt="InspoAI Logo" class='logoButton' />
                        <p class='cobaText'>Upgrade InspoAI Plus</p>
                    </button>
                    <button class='chatBaru'>
                        <img src="src/assets/chatBaru.svg" alt="Chat Baru" class='iconBaru' />
                    </button>
                    <img src="src/assets/avatar.svg" alt="user" class='userIcon' />
                  </div>
                <div class='mainCenter'>
                <div class='main-container'>
                    {messages().length === 0 && (
                        <>
                            <div class='greet'>
                                <p><span class='textGradient'>Apa yang bisa saya bantu?</span></p>
                            </div>
                            <div class='cards'>
                                <div class='card'>
                                    <p>Buatkan puisi tentang sekolah</p>
                                    <img src="src/assets/compas.svg" alt="compas" class='cardIcon' />
                                </div>
                                <div class='card'>
                                    <p>Eksperimen sains yang menarik</p>
                                    <img src="src/assets/lamp.svg" alt="lamp" class='cardIcon' />
                                </div>
                                <div class='card'>
                                    <p>Trik psikologi dalam berkomunikasi</p>
                                    <img src="src/assets/message.svg" alt="message" class='cardIcon' />
                                </div>
                                <div class='card'>
                                    <p>Perbaiki kode yang error</p>
                                    <img src="src/assets/code.svg" alt="code" class='cardIcon' />
                                </div>
                            </div>
                        </>
                    )}

                    <div class="message-list">
                        {messages().map((message) => (
                            <div class={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
                                {/* Render respons dengan HTML jika bukan pesan pengguna */}
                                <p innerHTML={message.isUser ? message.content : message.content}></p>
                            </div>
                        ))}
                        {isLoading() && (
                            <div class="message bot-message">
                                <div class="loading-animation">
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                </div>
                            </div>
                        )}
                    </div>


                    <div class='main-bottom'>
                        <div class='search-box'>
                            <input
                                type="text"
                                placeholder="Ketikkan pesan"
                                value={input()}
                                onInput={(e) => setInput(e.currentTarget.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                            />
                            <div>
                                <button class='imageButton'>
                                    <img src="src/assets/image.svg" alt="galeri" class='imageIcon'/>
                                </button>
                                <button class='voiceButton'>
                                    <img src="src/assets/voice.svg" alt="mic" class='voiceIcon'/>
                                </button>
                                <button class='sendButton' onClick={sendMessage}>
                                    <img
                                        src="src/assets/send.svg"
                                        alt="send"
                                        class='sendIcon'
                                    />
                                </button>
                            </div>
                        </div>
                        <p class="bottom-info">InspoAI dapat membuat kesalahan, periksa kembali responsnya</p>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default Main;