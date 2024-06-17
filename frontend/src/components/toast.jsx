import { useSearchParams } from 'react-router-dom';
import cancelIcon from '/src/assets/cancel.svg'
import completedIcon from '/src/assets/completed.svg'
import '../styles/toast.css'

export function Toast() {
    const [searchParams] = useSearchParams()
    const paymentStatus = searchParams.get('paymentStatus')
    console.log(paymentStatus);

    return (
        paymentStatus &&
        (paymentStatus === 'completed'
            ? <div className="toast">
                <div className="successful">
                    <img src={completedIcon} alt="cancel icon" width={40} />
                    <span className='mx-3'>Pedido realizado con éxito</span>
                </div>
            </div>
            : <div className="toast">
                <div className="canceled">
                    <img src={cancelIcon} alt="cancel icon" width={40} />
                    <span className='mx-3'>Pedido cancelado</span>
                </div>
            </div>
        )
    )
}