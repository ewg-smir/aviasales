import React from 'react';
import styles from './Categories.module.scss';

function Categories({ value, onClickCategory }) {
  return (
    <div className={styles.categories}>
      {value.map((category) => (
        <button
          type='button'
          key={category.id}
          className={`${styles.categoryButton} ${category.active ? styles.active : ''}`}
          onClick={() => onClickCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default Categories;
