/** @format */
//#region           External Libs
import { Ok } from "ts-results";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
//#endregion
//#region           Modules
import {
    Err,
    ErrorKind,
    ErrorOrigin,
} from "@/system/handlers/errHandlers";
import { client } from "//index";
//#endregion
//#region           Typing
export namespace pingTypes {
    export type data = () => Promise<Ok<CommandData>>;

    export type execute = (
        interaction: ChatInputCommandInteraction
    ) => Promise<Ok<void>>;
}
//#endregion
//#region           Variables
const commandName = "ping";
const commandLabel = "Ping";
//#endregion
//#region           Implementation
export const data: pingTypes.data = async () => {
    const description = {
        comm: "Checa a latência do bot!",
    };
    return new Ok({
        properties: {
            guild: false,
        },
        slashData: new SlashCommandBuilder()
            .setName(commandName)
            .setDescription(description.comm)
            .setDefaultMemberPermissions(0)
            .setDMPermission(false),
    });
};

export const execute: pingTypes.execute = async (interaction) => {
    try {
        const sent = await interaction.reply({
            content: "Pinging...",
            fetchReply: true,
        });

        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        await interaction.editReply(
            `Pong! Latência: ${latency}ms. Latência da API: ${apiLatency}ms`
        );

        return Ok.EMPTY;
    } catch (error) {
        throw new Err({
            message: "Erro ao executar o comando ping",
            kind: ErrorKind.Internal,
            origin: ErrorOrigin.Internal,
        });
    }
};
//#endregion
