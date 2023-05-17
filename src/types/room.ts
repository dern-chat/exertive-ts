import Message from "./message";

export default class Room {
    constructor(
        public name: string,
        public passphrase: string
    ) { }

    public users: string[] = []
    public messages: Message[] = []

    public addUser(username: string): void {
        if (username === '') {
            throw new Error('Username cannot be empty')
        }
        else if (this.users.includes(username)) {
            throw new Error('Username already taken')
        }

        this.users.push(username)
    }

    public addMessage(message: Message): void {
        this.messages.push(message)
    }
}