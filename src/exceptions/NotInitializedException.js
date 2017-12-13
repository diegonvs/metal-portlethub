function NotInitializedException() {}

NotInitializedException.prototype = Object.create(Error.prototype);

export default NotInitializedException;
