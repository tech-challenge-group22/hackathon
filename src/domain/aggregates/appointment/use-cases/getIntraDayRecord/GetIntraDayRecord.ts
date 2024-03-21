import TimeSheetRecord from "../../entities/TimeSheetRecord";
import IGateway from "../../interfaces/Gateway";
import IUseCase from "../../interfaces/UseCase";

export default class GetIntraDayRecord implements IUseCase {
    constructor(private gateway: IGateway) {}

    async execute(registry_number: number): Promise<TimeSheetRecord[]> {
        try {
            // Buscar registros de ponto para o userId fornecido
            const records = await this.gateway.getRecordsByUserId(registry_number);
            // adicionar filtragem aqui
            return records;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erro ao buscar registros: ${error.message}`);
            } else {
                // Se não for uma instância de Error, tratar de forma genérica
                throw new Error("Erro desconhecido ao buscar registros.");
            }
        }
    }
}