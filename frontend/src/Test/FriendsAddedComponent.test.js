const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { FriendsAddedComponent } = require('./FriendsAddedComponent');

const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.window = window;
global.document = window.document;

describe('FriendsAddedComponent', () => {
  it('debería renderizar sin errores', () => {
    const component = <FriendsAddedComponent />;
    const renderedComponent = renderToString(component);

    expect(renderedComponent).to.contain('Amigos Agregados');
    // Agrega más aserciones según sea necesario

    delete global.window;
    delete global.document;
  });
});
