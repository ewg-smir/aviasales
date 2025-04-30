import { useDispatch } from 'react-redux';
import { addTickets } from '../../store/ticketSlice';
import styles from './Snap.module.scss';

function Snap() {
  const dispatch = useDispatch();

  const onTicketsAdd = () => {
    dispatch(addTickets());
  };

  return (
    <button className={styles.button} onClick={onTicketsAdd} type='button'>
      ПОКАЗАТЬ ЕЩЕ 5 БИЛЕТОВ!
    </button>
  );
}

export default Snap;
