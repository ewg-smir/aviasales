import { add } from 'date-fns';
import styles from './Tickets.module.scss';

function Tickets({
  price,
  carrier,
  origin,
  destination,
  date,
  stops,
  duration,
  returnOrigin,
  returnDestination,
  returnDate,
  returnStops,
  returnDuration,
}) {
  const result = add(new Date(date), { minutes: duration });
  const returnResult = add(new Date(returnDate), { minutes: returnDuration });
  const travelDuration = (time) => {
    const totalMinutes = time;
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    let minutes = totalMinutes % 60;
    let hours = totalHours % 24;
    if (minutes < 10) minutes = `0${minutes}`;
    if (hours < 10) hours = `0${hours}`;

    let timeString = `${minutes}м`;

    if (totalDays > 0) {
      timeString = `${totalDays}д ${hours}ч ${timeString}`;
    } else if (totalHours > 0) {
      timeString = `${hours}ч ${timeString}`;
    }

    return timeString;
  };

  const travelStops = (arr) => {
    if (arr?.length > 0) {
      return arr.map((item, index) => (index !== arr.length - 1 ? `${item}, ` : `${item}`));
    }
    return '-';
  };

  const stopsCount = (arr) => {
    if (arr?.length > 0) {
      if (arr?.length === 1) {
        return '1 ПЕРЕСАДКА';
      }
      if (arr?.length > 1) {
        return `${arr.length} ПЕРЕСАДКИ`;
      }
      if (arr?.length > 4) {
        return `${arr.length} ПЕРЕСАДОК`;
      }
    }
    return 'БЕЗ ПЕРЕСАДОК';
  };

  return (
    <div className={styles.tickets}>
      <div className={styles.header}>
        <div className={styles.price}>{price?.toLocaleString('ru-RU')} Р </div>
        <img src={`https://pics.avs.io/99/36/${carrier}.png`} alt='carrier' />
      </div>
      <div className={styles.body}>
        <div>
          <div className={styles.title}>
            {origin}-{destination}
          </div>
          <div className={styles.information}>
            {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-
            {result.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div>
          <div className={styles.title}>В ПУТИ</div>
          <div className={styles.information}>{travelDuration(duration)}</div>
        </div>
        <div>
          <div className={styles.title}>{stopsCount(stops)}</div>
          <div className={styles.information}>{travelStops(stops)}</div>
        </div>
        <div>
          <div className={styles.title}>
            {returnOrigin}-{returnDestination}
          </div>
          <div className={styles.information}>
            {new Date(returnDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-
            {returnResult.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div>
          <div className={styles.title}>В ПУТИ</div>
          <div className={styles.information}>{travelDuration(returnDuration)}</div>
        </div>
        <div>
          <div className={styles.title}>{stopsCount(returnStops)}</div>
          <div className={styles.information}>{travelStops(returnStops)}</div>
        </div>
      </div>
    </div>
  );
}

export default Tickets;
