import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        
           // Login
            // {
            //     path: "/login",
            //     name: "Login",
            //     meta: {title: 'Login'},
            //     component: importComponent('Login'),
            // },

            {
                path: "/",
                component: importComponent('DashboardLayout'),
                children: [
                    //Dashboard
                    {
                        path: "/candidate",
                        name: "Candidate",
                        meta: {title: 'Candidate'},
                        component: importComponent('DataMaster/Candidate'),
                    },

                ]
            },

            
        {
            path: '*',
            redirect: '/'
        },

    ]
});

//set judul


export default router;