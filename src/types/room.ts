import Message from "./message";

export default class Room {
    constructor(
        public name: string,
        public passphrase: string
    ) { }

    public users: string[] = []
    public messages: Message[] = []

    public addUser(nickname: string): void {
        if (nickname === '') {
            throw new Error('nickname cannot be empty')
        }
        else if (this.users.includes(nickname)) {
            throw new Error('nickname already taken')
        }

        this.users.push(nickname)
    }

    public addMessage(message: Message): void {
        this.messages.push(message)
    }
}