# `@wvbe/simple-event`

A pure Javascript library for the world's simplest event. Works in the browser, NodeJS, Deno, etc.
Comes with types included.

### Examples

The world's simplest example"

```ts
const e = new SimpleEvent();
void e.on(() => {
	console.log('Something happened');
});
void e.emit();
```

Cancel a specific listener:

```ts
const destroyer = e.on(() => {
	console.log('Something happened');
});
destroyer();
```

Cancel all listeners:

```ts
const destroyer = e.on(() => {
	console.log('Something happened');
});
e.clear();
```

Wait for all event handlers to finish:

```ts
void e.on(async () => {
	await fetch(CMS_URL, { method: 'post' });
});
await e.emit();
```

Type the parameters expected for emit(), and received by listener:

```ts
const e = new SimpleEvent<[UserObject, PermissionsObject]>();
void e.on((user, permissions) => {
	// `user` and `permissions` argument are typed as
	// `UserObject` and `PermissionsObject` respectively
	console.log(user.name, permissions);
});
void e.emit(currentUser, defaultPermissions);
```
