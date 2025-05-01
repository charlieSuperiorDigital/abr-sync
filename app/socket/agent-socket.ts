// src/sockets/agent-socket.ts
import * as signalR from '@microsoft/signalr'

let connection: signalR.HubConnection | null = null

export const connectAgentHub = async (identity: string) => {
  if (connection) return connection // ya está conectada
  console.log('Conectando a AgentHub...')
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.NEXT_PUBLIC_TWILLIO_URL}/agentHub`, {
      withCredentials: true,
    }) // o tu dominio/ngrok
    .withAutomaticReconnect()
    .build()

  await connection.start()
  console.log('✅ Conectado a AgentHub')

  // Enviamos el nombre del agente al backend
  await connection.invoke('RegisterAgent', identity)

  return connection
}
