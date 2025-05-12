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

  const getStopsLabel = (count) => {
    if (count === 0) return 'Без пересадок';
    if (count === 1) return '1 пересадка';
    if (count >= 2 && count <= 4) return `${count} пересадки`;
    return `${count} пересадок`;
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filters.length === 0) return;

    const forwardLabel = getStopsLabel(ticket.segments[0].stops.length);
    const backwardLabel = getStopsLabel(ticket.segments[1].stops.length);

    return filters.includes(forwardLabel) && filters.includes(backwardLabel);
  });

  const getTotalDuration = (t) => t.segments[0].duration + t.segments[1].duration;

  const sortedTickets = useMemo(() => {
    if (filteredTickets.length === 0) return [];

    if (activeCategory.name === 'САМЫЙ ДЕШЕВЫЙ') {
      return [...filteredTickets].sort((a, b) => a.price - b.price);
    }

    if (activeCategory.name === 'САМЫЙ БЫСТРЫЙ') {
      return [...filteredTickets].sort((a, b) => getTotalDuration(a) - getTotalDuration(b));
    }

    if (activeCategory.name === 'ОПТИМАЛЬНЫЙ') {
      const maxPrice = Math.max(...filteredTickets.map((t) => t.price));
      const maxDuration = Math.max(...filteredTickets.map(getTotalDuration));

      return [...filteredTickets].sort((a, b) => {
        const scoreA = a.price / maxPrice + getTotalDuration(a) / maxDuration;
        const scoreB = b.price / maxPrice + getTotalDuration(b) / maxDuration;
        return scoreA - scoreB;
      });
    }

    return filteredTickets;
  }, [filteredTickets, activeCategory]);


  const visibleTickets = sortedTickets.slice(0, count);


  useEffect(() => {
    dispatch(fetchSearchId());
  }, [dispatch]);

  useEffect(() => {
    if (searchId) {
      dispatch(fetchTickets(searchId));
    }
  }, [dispatch, searchId]);

  const ticketsRes = visibleTickets.map((obj, index) => (
    <Tickets
      key={obj._id}
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
          {filters.length === 0 ? (
            <div>
              <h2 className={styles.h2}>Пожалуйста, выберите хотя бы один фильтр пересадок</h2>
            </div>
          ) : (
            <>
              {status !== 'error' && ticketsRes}
              {status !== 'error' && filteredTickets.length > 0 && <Button disabled={loadingMore} />}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
