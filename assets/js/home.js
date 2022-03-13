const closeChatBox = () => {
    let userChatBox = document.getElementById("user-chat-box");
    if (userChatBox.classList.contains("user-chat-box")) {
        userChatBox.classList.remove("user-chat-box");
        userChatBox.classList.add("hidden");
    }
}

const openChatBox = () => {
    let userChatBox = document.getElementById("user-chat-box");
    if (userChatBox.classList.contains("hidden")) {
        userChatBox.classList.add("user-chat-box");
        userChatBox.classList.remove("hidden");
    }
}