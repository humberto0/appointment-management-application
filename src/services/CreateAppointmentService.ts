import {startOfMinute} from "date-fns";
import {getCustomRepository} from "typeorm";
import Appointment from "../models/Appointment";
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from "../errors/AppError";

/*
* Recebimento das informações
* Tratativa de Erros/excessões
* Acesso ao repositorio
* */
interface RequestDTO {
    date: Date;
    provider_id: string;
}

/*
* dependency inversion(SOLID)
* */

class CreateAppointmentService {

    public async execute({date, provider_id}: RequestDTO): Promise<Appointment> {
        const appointmentsRepository=getCustomRepository(AppointmentsRepository)

        const appointmentDate = startOfMinute(date);
        const findAppointmentInSameDate = await appointmentsRepository.findBydate(appointmentDate)
        if (findAppointmentInSameDate) {
            throw new AppError('this appointment is already booked')
        }
        const appointment = appointmentsRepository.create(
            {
                provider_id,
                date: appointmentDate
            })
        await appointmentsRepository.save(appointment)
        return appointment
    }

}

export default CreateAppointmentService
