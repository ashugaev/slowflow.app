/**
 * Константы
 * - isEditModalOpen
 * - channelImages
 * - channelData
 * - categoriesList
 * - categoryTypesList
 * - channelCategories
 *
 * Mетоды
 * - openEditModal(channelData, channelCategories)
 * - closeEditModal
 * - saveChannelData
 * - fetchChannelImages
 * - fetchCategories
 * - fetchCategoryTypes
 * - addCategory
 * - addCategoryType
 *
 * Новые методы в channel-store
 * - updateChannelData(channelData, i)
 */

import {
  observable, action, runInAction,
} from 'mobx';
import axious from 'axios';

class ItemEditModalStore {
  @observable modalIsOpen = false

  @observable modalItemImagesLoading = false

  @observable modalItemImages = []

  @observable modalItemData = {}

  @observable channelData = {}

  @observable channelCategories = []

  @action.bound
  onItemEditModalOpen({ channelData, channelCategories }) {
    this.modalIsOpen = true;
    this.channelData = channelData;
    this.channelCategories = channelCategories;


    this.fetchChannelImages({ id: channelData.id });
  }

  @action.bound
  onItemEditModalClose() {
    this.modalIsOpen = false;
  }

  @action.bound
  fetchChannelImages({ id, callback, callbackArgs }) {
    this.modalItemImagesLoading = true;

    axious.get('/api/channel_images/', {
      params: {
        id,
      },
    })
      .then(({ data }) => runInAction(() => {
        this.modalItemImages.replace(data);

        callback && callback(data, callbackArgs);
      }))
      .catch((err) => {
        console.log(err);
      })
      .finally(() => runInAction(() => {
        this.modalItemImagesLoading = false;
      }));
  }
}

export default new ItemEditModalStore();