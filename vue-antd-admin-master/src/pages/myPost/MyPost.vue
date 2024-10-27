<!-- YourComponent.vue -->
<template>
  <div>
    <Club :club="myClub"></Club>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import Club from "@/components/club/Club.vue";

export default {
  components: {
    Club,
  },
  data() {
    return {
      myClub: null,
    };
  },
  computed: {
    ...mapGetters('account', ['user']),
    // 其他 computed 属性
  },
  created() {
    this.fetchData(this.user.id);
  },
  methods: {
    async fetchComments(posts) {
      // 获取每个帖子的评论
      for (const post of posts) {
        post.modifyAble = true;
        const commentsResponse = await axios.get(`http://localhost:8080/iClub/getPostComments/${post.Pid}`);
        console.log(commentsResponse);

        // 将评论赋值给相应的帖子
        post.comments = commentsResponse.data.comments;
      }
    },
  },
};
</script>
