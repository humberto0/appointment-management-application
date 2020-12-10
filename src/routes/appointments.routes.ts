import {Router} from 'express'
import {parseISO} from 'date-fns'
import {getCustomRepository} from "typeorm";
import AppointmentsRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentService from "../services/CreateAppointmentService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

//receber uma requisição , chamar um outro serviços e devolver uma resposta
const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);
appointmentsRouter.get('/', async (req, res) => {
    console.log(req.user)
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appointments = await appointmentsRepository.find()
    return res.json(appointments);
})
appointmentsRouter.post('/', async (req, res) => {

        const {provider_id, date} = req.body;
        const parsedDate = parseISO(date)
        const createAppointmennt = new CreateAppointmentService();
        const appointment = await createAppointmennt.execute(
            {
                date: parsedDate,
                provider_id
            });
        return res.json(appointment)

})
export default appointmentsRouter;





