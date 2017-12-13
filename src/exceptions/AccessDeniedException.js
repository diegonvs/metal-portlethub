function AccessDeniedException() {}

AccessDeniedException.prototype = Object.create(Error.prototype);

export default AccessDeniedException;
