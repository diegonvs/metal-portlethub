import api from './api';

// Create implementation
const impl = new PortletImpl();

// TODO: init implementation

// Publish stuff
window.portlet = new api.Portlet(impl);
