import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Grantly's AI assistant. I can help you with scholarship opportunities, application tips, and platform features. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const predefinedResponses = {
    "hello": "Hello! I'm here to help you with your scholarship journey. What would you like to know?",
    "scholarships": "I can help you find scholarships based on your profile. Our AI matches you with opportunities that fit your academic background, interests, and goals. Would you like to know more about specific types of scholarships?",
    "application": "For scholarship applications, I recommend: 1) Start early 2) Read requirements carefully 3) Tailor your essays 4) Get strong recommendation letters 5) Track deadlines. Need specific advice on any of these?",
    "pricing": "Grantly offers three plans: Basic (Free), Pro ($19/month), and Premium ($39/month). The Basic plan includes up to 10 matches per month, while paid plans offer unlimited matching and advanced features.",
    "help": "I can assist with: Finding scholarships, Application tips, Platform features, Pricing information, Success strategies. Just ask me anything!",
    "deadlines": "Managing deadlines is crucial! I recommend setting up reminders 2 weeks before each deadline, creating a calendar of all applications, and prioritizing by deadline date and scholarship value.",
    "essays": "For great scholarship essays: 1) Tell your unique story 2) Answer the prompt directly 3) Show, don't tell 4) Be authentic 5) Proofread carefully. Want tips for specific essay types?",
    "default": "That's a great question! For detailed guidance on scholarship strategies, I'd recommend checking our Resources section or connecting with our community mentors. Is there something specific about scholarships or applications I can help with?"
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("hello") || message.includes("hi")) return predefinedResponses.hello;
    if (message.includes("scholarship") || message.includes("funding")) return predefinedResponses.scholarships;
    if (message.includes("application") || message.includes("apply")) return predefinedResponses.application;
    if (message.includes("price") || message.includes("cost") || message.includes("plan")) return predefinedResponses.pricing;
    if (message.includes("help") || message.includes("support")) return predefinedResponses.help;
    if (message.includes("deadline") || message.includes("due date")) return predefinedResponses.deadlines;
    if (message.includes("essay") || message.includes("writing")) return predefinedResponses.essays;
    
    return predefinedResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-gradient-primary shadow-button hover:scale-105 transition-all"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 shadow-xl border-border bg-card">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-lg">Grantly Assistant</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.isBot ? (
                        <Bot className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.isBot ? 'Grantly' : 'You'}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Ask about scholarships, applications, or platform features
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;