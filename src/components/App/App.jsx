import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';
import { setCategory, selectCategory } from '../../store/categorySlice';
import { fetchTickets, fetchSearchId, selectTickets } from '../../store/ticketSlice';
import styles from './App.module.scss';
import Categories from '../Categories/Categories';
import Transfers from '../Transfers/Transfers';
import Tickets from '../Tickets/Tickets';
import Button from '../Snap/Snap';

function App() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategory);
  const { tickets, status, filters, count, searchId, loadingMore } = useSelector(selectTickets);

  const onChangeCategory = (id) => {
    dispatch(setCategory(id));
  };

  const activeCategory = categories.find((category) => category.active);

  const filteredTickets = tickets.filter((ticket) => {
    if (filters.length === 0) return true;

    const forwardStops = ticket.segments[0].stops.length;
    const backwardStops = ticket.segments[1].stops.length;

    // prettier-ignore
    const forwardLabel = forwardStops === 0 ? 'Без пересадок' : `${forwardStops} пересадк${forwardStops === 1 ? 'а' : 'и'}`;
    // prettier-ignore
    const backwardLabel = backwardStops === 0 ? 'Без пересадок' : `${backwardStops} пересадк${backwardStops === 1 ? 'а' : 'и'}`;

    return filters.includes(forwardLabel) && filters.includes(backwardLabel);
  });
  const sortTickets = [...filteredTickets].slice(0, count).sort((a, b) => {
    const getTotalDuration = (t) => t.segments[0].duration + t.segments[1].duration;
    if (activeCategory.name === 'САМЫЙ ДЕШЕВЫЙ') {
      return a.price - b.price;
    }
    if (activeCategory.name === 'САМЫЙ БЫСТРЫЙ') {
      const durationA = a.segments[0].duration + a.segments[1].duration;
      const durationB = b.segments[0].duration + b.segments[1].duration;
      return durationA - durationB;
    }
    if (activeCategory.name === 'ОПТИМАЛЬНЫЙ') {
      if (filteredTickets.length === 0) return 0;

      const maxPrice = Math.max(...filteredTickets.map((t) => t.price));
      const maxDuration = Math.max(...filteredTickets.map(getTotalDuration));

      const scoreA = a.price / maxPrice + getTotalDuration(a) / maxDuration;
      const scoreB = b.price / maxPrice + getTotalDuration(b) / maxDuration;
      return scoreA - scoreB;
    }
    return 0;
  });

  useEffect(() => {
    dispatch(fetchSearchId());
  }, [dispatch]);

  useEffect(() => {
    if (searchId) {
      dispatch(fetchTickets(searchId));
    }
  }, [dispatch, searchId]);

  const ticketsRes = sortTickets.map((obj) => (
    <Tickets
      key={`${obj.carrier}-${obj.price}-${obj.segments[0].date}`}
      price={obj.price}
      carrier={obj.carrier}
      origin={obj.segments[0].origin}
      destination={obj.segments[0].destination}
      date={obj.segments[0].date}
      stops={obj.segments[0].stops}
      duration={obj.segments[0].duration}
      returnOrigin={obj.segments[1].origin}
      returnDestination={obj.segments[1].destination}
      returnDate={obj.segments[1].date}
      returnStops={obj.segments[1].stops}
      returnDuration={obj.segments[1].duration}
    />
  ));

  return (
    <div className={styles.App}>
      <div className={styles.logo}>
        <img src='/Logo.png' alt='Logo' />
      </div>
      <div className={styles.wrapper}>
        <Transfers />
        <div className='App__results'>
          <Categories value={categories} onClickCategory={onChangeCategory} />
          {status === 'loading' && !loadingMore && <Spin className={styles.spin} size='large' />}
          {status === 'loading' && loadingMore && <div className={styles.loadingMore}>Загружаются новые билеты...</div>}
          {status === 'error' && (
            <div>
              <h2 className={styles.h2}>Произошла ошибка при загрузке билетов 😢</h2>
            </div>
          )}
          {status === 'success' && filteredTickets.length === 0 && (
            <div>
              <h2 className={styles.h2}>Рейсов, подходящих под заданные фильтры, не найдено</h2>
            </div>
          )}
          {status !== 'error' && filters.length > 0 && ticketsRes}
          {status === 'success' && filteredTickets.length > 0 && !loadingMore && <Button />}
        </div>
      </div>
    </div>
  );
}

export default App;
