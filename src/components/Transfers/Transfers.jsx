import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Checkbox } from 'antd';
import { setFilters, selectTicketsFilters } from '../../store/ticketSlice';
import { setSelectedValues, setSelectedAllValues, selectCheckbox } from '../../store/checkboxSlice';
import styles from './Transfers.module.scss';

function Transfers() {
  const dispatch = useDispatch();
  const checkboxes = useSelector(selectCheckbox);
  const filters = useSelector(selectTicketsFilters);

  const checkedList = checkboxes.filter((item) => item.checked).map((item) => item.name);
  const checkboxOptions = checkboxes.map((item) => item.name);
  const indeterminate = checkedList.length > 0 && checkedList.length < checkboxes.length;
  const checkAll = checkboxes.length === checkedList.length;

  const onChangeSelectedValues = (checkedValues) => {
    dispatch(setSelectedValues(checkedValues));
    dispatch(setFilters(checkedValues));
  };

  const onChangeSelectedAllValues = (e) => {
    dispatch(setSelectedAllValues(e.target.checked));
    if (e.target.checked) {
      dispatch(setFilters(['Без пересадок', '1 пересадка', '2 пересадки', '3 пересадки']));
    } else {
      dispatch(setFilters([]));
    }
  };
  return (
    <div className={styles.transfers}>
      <h1 className={styles.title}>КОЛИЧЕСТВО ПЕРЕСАДОК</h1>
      <div className={styles.options}>
        <Checkbox indeterminate={indeterminate} onChange={onChangeSelectedAllValues} checked={checkAll}>
          Все
        </Checkbox>
        <div className={styles.checkboxGroup}>
          <Checkbox.Group options={checkboxOptions} onChange={onChangeSelectedValues} value={checkedList} />
        </div>
      </div>
    </div>
  );
}

export default Transfers;
