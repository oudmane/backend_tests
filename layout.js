require('./uikit.theme.min.css')

export default {
    name: 'layout',
    render() {
      return <div>
          <h2>Anaa hnaaaa</h2>
          <router-view></router-view>
      </div>
    },
    meta() {
        return {
            link: [
                // { rel: 'stylesheet', href: 'https://oudmane.me/live/uikit.theme.min.css' },
                { rel: 'icon', href: 'data:;base64,iVBORw0KGgo=' }
              ]
        }
    }
  }