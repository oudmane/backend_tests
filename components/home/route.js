export default {
    path: '/',
    component: {
        meta() {
            return {
                title: 'Helloooo'
            }
        },
        render(h) {
            return <div>
                <h2>Hello world</h2>
                <p>Labass !</p>
            </div>
        }
    }
}