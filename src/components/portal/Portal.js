import { Component } from 'react';
import ReactDOM from 'react-dom';
/**
 * Порталы предоставляют первоклассный способ отображения дочерних элементов в узел DOM, 
 * который существует вне иерархии DOM родительского компонента.
 * Первым аргументом (child) является любой отображаемый потомок React, 
 * такой как элемент, строка или фрагмент. Второй аргумент (container) является элементом DOM.
 * 
 * Типичный вариант использования порталов - это когда родительский компонент 
 * имеет overflow: hidden или z-index стиль, но вам нужно, 
 * чтобы дочерний компонент визуально «выходил» из своего контейнера. 
 * Например, диалоги, всплывающие подсказки.
 * 
*/
class Portal extends Component {

  element = document.createElement('div');

  componentDidMount() {
    document.body.appendChild(this.element);
  }

  componentWillUnmount() {
    document.body.removeChild(this.element);
  }

  render() {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.element);
  }
}

export default Portal;
